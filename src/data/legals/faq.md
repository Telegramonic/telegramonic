# Frequently Asked Questions (FAQs)

**Last Updated:** May 30, 2026

Find answers to common questions about Telegramonic's storage, security, features, and setup. If you can't find what you are looking for, please feel free to **[contact us](/contact-us)**.

---

## 1. General Questions

### 1.1 What is Telegramonic?

Telegramonic is an advanced web application that provides a clean, visual, drive-like cloud storage manager built on top of your Telegram account. It allows you to organize, upload, download, and share files stored directly in Telegram's cloud storage.

### 1.2 Is Telegramonic storage really unlimited?

Yes! Telegramonic utilizes Telegram's APIs, which do not impose overall storage quotas. You can store as many files as you want.

### 1.3 How much does Telegramonic cost?

The core features of Telegramonic are completely free to use. There are no subscriptions, ads, or data cap fees.

---

## 2. Security and Privacy

### 2.1 Can Telegramonic read or view my files?

No. Telegramonic acts as a visual interface client. Authentication and file delivery are handled securely on your device, communicating directly with Telegram's servers. We are zero-knowledge by design and do not possess keys to decrypt or view your files.

### 2.2 How is my account secured?

Your account is secured using Telegram's native login system. We do not store your password or session authorization codes. Authentication token exchanges are short-lived and cryptographically signed.

### 2.3 Are my files encrypted?

Yes. Files uploaded to Telegram are protected by **MTProto encryption** at rest on Telegram's distributed servers and are encrypted in transit via **TLS 1.3**.

---

## 3. Uploads, Downloads & Limits

### 3.1 What is the maximum file size I can upload?

Individual file size limits match Telegram's standard limits:

- **Free Accounts:** Up to **2 GB** per file.
- **Telegram Premium Accounts:** Up to **4 GB** per file.

### 3.2 What file formats are supported?

All file formats are supported. You can upload documents, videos, music, archives, and code files.

### 3.3 Why is my download/upload speed slow?

Since all file transfers go directly through Telegram's distributed server infrastructure, speeds are dependent on your network connection, your geographic location relative to Telegram's nearest data center, and current Telegram network load.

---

## 4. Troubleshooting

### 4.1 How do I sign out?

You can sign out at any time by clicking the account dropdown profile in the top header and selecting **Sign Out**. This will instantly clear all authentication tokens from your local browser storage.

### 4.2 I didn't receive my login code. What should I do?

Telegram login codes are sent directly to your active Telegram application on another device (or via SMS if no active sessions exist). Please ensure your official Telegram app is open and connected to the internet.
