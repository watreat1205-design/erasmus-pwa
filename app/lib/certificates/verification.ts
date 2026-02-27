import crypto from "crypto";

export function generateVerificationCode(): string {
  // short-ish, URL-safe
  return crypto.randomBytes(16).toString("hex"); // 32 chars
}

export function generateCertificateNumber(): string {
  // Example format: CCIF-2026-<random>
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `CCIF-${year}-${suffix}`;
}

