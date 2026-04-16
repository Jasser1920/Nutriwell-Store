import { ApiError, apiRequest } from "@/lib/api";

export type ContactReportStatus = "nouveau" | "traite" | "archive";

export interface ContactReportFormInput {
  subject: string;
  message: string;
  email: string;
  profileType: string;
  civility: string;
  lastName: string;
  firstName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phonePrefix: string;
  phoneNumber: string;
  attachmentUrl: string | null;
}

export interface ContactReportItem {
  id: string;
  subject: string;
  email: string;
  last_name: string;
  first_name: string;
  status: ContactReportStatus;
  created_at: string;
}

export interface ContactReportDetail extends ContactReportItem {
  message: string;
  profile_type: string | null;
  civility: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  phone_prefix: string | null;
  phone_number: string | null;
  attachment_url: string | null;
}

const clean = (value: string) => value.trim();

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadContactAttachment = async (file: File, email: string) => {
  const formData = new FormData();
  formData.append("email", clean(email).toLowerCase().replace(/[^a-z0-9@._-]/g, "") || "anonymous");
  formData.append("file", file, sanitizeFileName(file.name || `attachment-${Date.now()}`));
  const response = await apiRequest<{ path: string; url?: string }>("uploads/contact-attachment", {
    method: "POST",
    body: formData,
  });
  return response.path || response.url || "";
};

export const getContactAttachmentSignedUrl = async (path: string) => {
  const response = await apiRequest<{ url: string }>("admin/contact-reports/attachment", {
    method: "GET",
    query: { path },
  });
  return response.url;
};

export const createContactReport = async (input: ContactReportFormInput) => {
  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);

  const requiredPayload: Record<string, string> = {
    subject: clean(input.subject),
    message: clean(input.message),
    email: clean(input.email),
    last_name: lastName,
    first_name: firstName,
  };

  const payload: Record<string, string> = {
    ...requiredPayload,
    status: "nouveau" as ContactReportStatus,
  };

  const profileType = clean(input.profileType);
  const civility = clean(input.civility);
  const address = clean(input.address);
  const postalCode = clean(input.postalCode);
  const city = clean(input.city);
  const country = clean(input.country);
  const phonePrefix = clean(input.phonePrefix);
  const phoneNumber = clean(input.phoneNumber);

  if (profileType) payload.profile_type = profileType;
  if (civility) payload.civility = civility;
  if (address) payload.address = address;
  if (postalCode) payload.postal_code = postalCode;
  if (city) payload.city = city;
  if (country) payload.country = country;
  if (phoneNumber) {
    payload.phone_number = phoneNumber;
    if (phonePrefix) payload.phone_prefix = phonePrefix;
  }
  if (input.attachmentUrl) payload.attachment_url = input.attachmentUrl;

  try {
    await apiRequest<{ id: string }>("contact-reports", { method: "POST", body: payload });
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      await apiRequest<{ id: string }>("contact-reports", { method: "POST", body: requiredPayload });
      return;
    }
    throw error;
  }
};

export const fetchAdminContactReports = async (): Promise<ContactReportItem[]> => {
  const response = await apiRequest<{ reports: ContactReportItem[] }>("admin/contact-reports", { method: "GET" });
  return response.reports ?? [];
};

export const fetchAdminContactReportById = async (id: string): Promise<ContactReportDetail> => {
  const response = await apiRequest<{ report: ContactReportDetail }>(`admin/contact-reports/${id}`, { method: "GET" });
  return response.report;
};

export const updateContactReportStatus = async (id: string, status: ContactReportStatus) => {
  await apiRequest<{ success: boolean }>(`admin/contact-reports/${id}`, {
    method: "PATCH",
    body: { status },
  });
};
