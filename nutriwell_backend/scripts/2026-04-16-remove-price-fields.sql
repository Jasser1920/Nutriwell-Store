-- Migration: Remove price and price_per_unit columns from products table
ALTER TABLE products
  DROP COLUMN price,
  DROP COLUMN price_per_unit;
