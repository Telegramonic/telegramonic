# Direct-to-API Storage Engine

Unlike traditional cloud services, Telegramonic does not manage any storage hardware. Instead, it utilizes Telegram's message-based document protocol.

## Storing Files as Documents

Every file uploaded through Telegramonic is divided into dynamic chunks, sent via MTProto, and stored as an encrypted message document:

1. **Chunking**: Large files are split into standard chunks (up to 512KB each).
2. **Uploading**: Chunks are uploaded in parallel to Telegram's media servers.
3. **Saving**: Once completed, a document message containing the file info is saved to your private Telegram storage cloud.

## Key Advantages

- **Zero Storage Costs**: Telegram provides infinite storage capacity for documents.
- **Maximum File Sizes**: Support for file uploads up to 2GB (or 4GB for Telegram Premium accounts) in size.
- **Full Ownership**: Since files are stored directly inside your Telegram account, you can access them via any official Telegram client.
