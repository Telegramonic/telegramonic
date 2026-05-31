# MTProto Protocol Architecture

Telegramonic utilizes Telegram's native MTProto 2.0 protocol to manage all network transport layers.

MTProto is designed to be extremely fast and robust, even on unstable mobile connections or high-latency networks.

## Core Encryption Details

MTProto 2.0 uses a combinations of cryptographic primitives to secure data in transit:

- **Symmetric Encryption**: AES-256 in Infinite Garble Extension (IGE) mode.
- **Key Exchange**: Diffie-Hellman (DH) key exchange during auth keys negotiation.
- **Message Verification**: SHA-256 signatures to verify cryptographic integrity.

## Secure Local Sessions

All authorization keys and token associations are stored strictly within your local environment:
- Keys are never dispatched to third-party databases.
- The Axum server facilitates translation of client requests into MTProto messages using the `grammers` Rust library.
