import React, { useMemo } from 'react';
import { Box, VStack, HStack, Stack, Text, Button, Center, Input } from '@chakra-ui/react';
import { useCurrentUser, apiClient } from '@services';
import { appStore } from '@appStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileTabProps {
  onLogout: () => void;
}

export const ProfileTab = ({ onLogout }: ProfileTabProps) => {
  const { data: currentUser } = useCurrentUser();

  const currentAccount = appStore((state) => state.currentAccount);
  const saveAccount = appStore((state) => state.saveAccount);
  const setCurrentAccount = appStore((state) => state.setCurrentAccount);

  // API credentials local states
  const [apiId, setApiId] = React.useState(currentAccount?.apiId || '');
  const [apiHash, setApiHash] = React.useState(currentAccount?.apiHash || '');
  const [showApiId, setShowApiId] = React.useState(false);
  const [showApiHash, setShowApiHash] = React.useState(false);

  // Saving states
  const [saveStatus, setSaveStatus] = React.useState<{ type: 'success' | 'error' | null; message: string | null }>({
    type: null,
    message: null,
  });

  // Credentials Verification local states
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = React.useState(false);
  const [verificationStep, setVerificationStep] = React.useState<'idle' | 'code' | 'password' | 'success'>('idle');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [verificationPassword, setVerificationPassword] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const [verificationLoading, setVerificationLoading] = React.useState(false);
  const [phoneCodeHash, setPhoneCodeHash] = React.useState('');

  const fullName = useMemo(() => {
    if (!currentUser) return 'Loading...';
    return `${currentUser.first_name} ${currentUser.last_name || ''}`.trim();
  }, [currentUser]);

  const initials = useMemo(() => {
    if (!currentUser) return 'U';
    const firstInitial = currentUser.first_name?.[0] || '';
    const lastInitial = currentUser.last_name?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  }, [currentUser]);
  const isChanged = useMemo(() => {
    const originalApiId = currentAccount?.apiId || '';
    const originalApiHash = currentAccount?.apiHash || '';
    return apiId.trim() !== originalApiId.trim() || apiHash.trim() !== originalApiHash.trim();
  }, [apiId, apiHash, currentAccount]);

  React.useEffect(() => {
    setApiId(currentAccount?.apiId || '');
    setApiHash(currentAccount?.apiHash || '');
  }, [currentAccount]);

  const handleSaveCredentials = () => {
    if (!apiId.trim() || !apiHash.trim()) {
      setSaveStatus({
        type: 'error',
        message: 'API ID and API Hash cannot be empty.',
      });
      return;
    }
    setSaveStatus({ type: null, message: null });
    setIsConfirmSaveOpen(true);
  };

  const handleStartCredentialsUpdate = async () => {
    setIsConfirmSaveOpen(false);

    const phone = currentUser?.phone || currentAccount?.phone;
    if (!phone) {
      setSaveStatus({
        type: 'error',
        message: 'Phone number not found. Cannot verify credentials.',
      });
      return;
    }

    setVerificationStep('code');
    setVerificationLoading(true);
    setVerificationError('');
    setVerificationCode('');
    setVerificationPassword('');

    try {
      const res = await apiClient.sendCode(phone, apiId.trim(), apiHash.trim());
      if (res.success) {
        setPhoneCodeHash(res.next_step || 'mock_hash');
      } else {
        setVerificationError(res.error || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setVerificationError(err.message || 'Server connection error.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const phone = currentUser?.phone || currentAccount?.phone;
    if (!phone) return;

    setVerificationLoading(true);
    setVerificationError('');

    try {
      const res = await apiClient.signIn(phone, verificationCode, phoneCodeHash);
      if (res.success) {
        if (res.next_step === 'password') {
          setVerificationStep('password');
        } else {
          // Success
          saveAccount(phone, apiId.trim(), apiHash.trim());
          setCurrentAccount({
            phone,
            apiId: apiId.trim(),
            apiHash: apiHash.trim(),
          });
          setVerificationStep('success');
        }
      } else {
        setVerificationError(res.error || 'Invalid code.');
      }
    } catch (err: any) {
      setVerificationError(err.message || 'Verification failed.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyPassword = async () => {
    const phone = currentUser?.phone || currentAccount?.phone;
    if (!phone) return;

    setVerificationLoading(true);
    setVerificationError('');

    try {
      const res = await apiClient.checkPassword(verificationPassword);
      if (res.success) {
        // Success
        saveAccount(phone, apiId.trim(), apiHash.trim());
        setCurrentAccount({
          phone,
          apiId: apiId.trim(),
          apiHash: apiHash.trim(),
        });
        setVerificationStep('success');
      } else {
        setVerificationError(res.error || 'Incorrect 2FA password.');
      }
    } catch (err: any) {
      setVerificationError(err.message || 'Verification failed.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleCancelVerification = () => {
    setVerificationStep('idle');
    setVerificationCode('');
    setVerificationPassword('');
    setVerificationError('');
  };

  return (
    <VStack align="stretch" gap={8} maxW="800px" mx="auto" py={4}>
      {/* Page Title */}
      <VStack align="stretch" gap={1}>
        <Text fontSize="2xl" fontWeight="extrabold" color="fg">
          Account Profile
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Manage your account profile details, Telegram API credentials, and cloud drive settings.
        </Text>
      </VStack>

      {/* User Card */}
      <VStack
        bg={{ base: 'white', _dark: '#131c26' }}
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{ base: 6, sm: 8 }}
        align="center"
        justify="center"
        gap={4}
        shadow="md"
      >
        <Center
          w={24}
          h={24}
          borderRadius="full"
          bg="primary/10"
          border="2px solid"
          borderColor="primary"
          color="primary"
          fontSize="4xl"
          fontWeight="bold"
        >
          {initials}
        </Center>
        <VStack gap={0.5} align="center">
          <Text fontSize="xl" fontWeight="extrabold" color="fg">
            {fullName}
          </Text>
          {currentUser?.username && (
            <Text fontSize="sm" color="primary" fontWeight="semibold">
              @{currentUser.username}
            </Text>
          )}
        </VStack>
      </VStack>

      {/* Account Info Details */}
      <VStack
        bg={{ base: 'white', _dark: '#131c26' }}
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{ base: 4, sm: 6 }}
        align="stretch"
        gap={4}
        shadow="md"
      >
        <Text fontWeight="extrabold" fontSize="md" color="fg" pb={2} borderBottom="1px solid" borderColor="border/30">
          Account Information
        </Text>

        {[
          { label: 'First Name', value: currentUser?.first_name || '—' },
          { label: 'Last Name', value: currentUser?.last_name || '—' },
          { label: 'Phone Number', value: currentUser?.phone || '—' },
          { label: 'User ID', value: currentUser?.id || '—', copyable: true },
          { label: 'Username', value: currentUser?.username ? `@${currentUser.username}` : '—', copyable: !!currentUser?.username }
        ].map((item) => (
          <Stack
            key={item.label}
            py={2.5}
            justify="space-between"
            align={{ base: 'stretch', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 1, sm: 4 }}
          >
            <Text fontSize="sm" fontWeight="bold" color="fg.muted" w={{ base: 'auto', sm: '140px' }}>
              {item.label}
            </Text>
            <HStack flex={1} justify="space-between" overflow="hidden" w="100%">
              <Text fontSize="sm" color="fg" fontWeight="semibold" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" minW={0}>
                {item.value}
              </Text>
              {item.copyable && item.value !== '—' && (
                <CopyButton text={item.value.replace(/^@/, '')} />
              )}
            </HStack>
          </Stack>
        ))}
      </VStack>

      {/* Telegram Credentials configuration section */}
      <VStack
        bg={{ base: 'white', _dark: '#131c26' }}
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{ base: 4, sm: 6 }}
        align="stretch"
        gap={5}
        shadow="md"
      >
        <VStack align="stretch" gap={1}>
          <Text fontWeight="extrabold" fontSize="md" color="fg">
            Telegram API Credentials
          </Text>
          <Text fontSize="xs" color="fg.muted">
            Configure the API credentials used to connect to the Telegram MTProto servers.
          </Text>
        </VStack>

        <VStack align="stretch" gap={4} pt={2} borderTop="1px solid" borderColor="border/30">
          {/* API ID Input */}
          <VStack align="stretch" gap={1.5}>
            <Text fontSize="xs" fontWeight="bold" color="fg.muted">
              API ID
            </Text>
            <HStack position="relative" w="100%">
              <Input
                type={showApiId ? 'text' : 'password'}
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                placeholder="Enter Telegram API ID (e.g. 1234567)"
                border="1px solid"
                borderColor="border"
                borderRadius="xl"
                h="40px"
                pl={3}
                pr="80px"
                fontSize="sm"
                color="fg"
                bg="transparent"
                _focus={{
                  borderColor: 'primary',
                  ring: '1px',
                  ringColor: 'primary',
                }}
              />
              <Button
                size="xs"
                position="absolute"
                right={2}
                onClick={() => setShowApiId(!showApiId)}
                variant="ghost"
                color="primary"
                h="28px"
                borderRadius="lg"
                fontSize="2xs"
                fontWeight="bold"
              >
                {showApiId ? 'Hide' : 'Show'}
              </Button>
            </HStack>
          </VStack>

          {/* API Hash Input */}
          <VStack align="stretch" gap={1.5}>
            <Text fontSize="xs" fontWeight="bold" color="fg.muted">
              API Hash
            </Text>
            <HStack position="relative" w="100%">
              <Input
                type={showApiHash ? 'text' : 'password'}
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                placeholder="Enter Telegram API Hash (e.g. abcdef123456...)"
                border="1px solid"
                borderColor="border"
                borderRadius="xl"
                h="40px"
                pl={3}
                pr="80px"
                fontSize="sm"
                color="fg"
                bg="transparent"
                _focus={{
                  borderColor: 'primary',
                  ring: '1px',
                  ringColor: 'primary',
                }}
              />
              <Button
                size="xs"
                position="absolute"
                right={2}
                onClick={() => setShowApiHash(!showApiHash)}
                variant="ghost"
                color="primary"
                h="28px"
                borderRadius="lg"
                fontSize="2xs"
                fontWeight="bold"
              >
                {showApiHash ? 'Hide' : 'Show'}
              </Button>
            </HStack>
          </VStack>
        </VStack>

        {saveStatus.message && (
          <Box
            p={3.5}
            borderRadius="xl"
            bg={saveStatus.type === 'success' ? 'success.500/10' : 'error.500/10'}
            border="1px solid"
            borderColor={saveStatus.type === 'success' ? 'success.500/30' : 'error.500/30'}
          >
            <Text fontSize="xs" fontWeight="bold" color={saveStatus.type === 'success' ? 'success.400' : 'error.400'}>
              {saveStatus.message}
            </Text>
          </Box>
        )}

        <Stack
          direction={{ base: 'column', sm: 'row' }}
          justify="flex-end"
          pt={2}
          align={{ base: 'stretch', sm: 'center' }}
        >
          <Button
            onClick={handleSaveCredentials}
            bg="primary"
            color="white"
            h="38px"
            px={5}
            borderRadius="xl"
            fontSize="xs"
            fontWeight="bold"
            w={{ base: '100%', sm: 'auto' }}
            alignSelf={{ base: 'stretch', sm: 'auto' }}
            disabled={!isChanged}
            opacity={isChanged ? 1 : 0.5}
            cursor={isChanged ? 'pointer' : 'not-allowed'}
            _hover={{ filter: isChanged ? 'brightness(1.1)' : 'none' }}
          >
            Save Credentials
          </Button>
        </Stack>
      </VStack>

      {/* Account actions card at the very last */}
      <VStack
        bg={{ base: 'white', _dark: '#131c26' }}
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{ base: 4, sm: 6 }}
        align="stretch"
        gap={4}
        shadow="md"
      >
        <Text fontWeight="extrabold" fontSize="md" color="fg">
          Account Actions
        </Text>
        <Stack
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          pt={2}
          borderTop="1px solid"
          borderColor="border/30"
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
        >
          <VStack align="start" gap={0.5}>
            <Text fontSize="sm" fontWeight="bold" color="fg">
              Disconnect Account
            </Text>
            <Text fontSize="xs" color="fg.muted">
              Log out of your Telegram session and delete local credentials cache on this device.
            </Text>
          </VStack>
          <Button
            onClick={onLogout}
            bg="red.500"
            color="white"
            _hover={{ bg: 'red.600' }}
            h="36px"
            px={4}
            borderRadius="xl"
            fontSize="xs"
            fontWeight="bold"
            alignSelf={{ base: 'stretch', sm: 'auto' }}
            w={{ base: '100%', sm: 'auto' }}
          >
            Logout
          </Button>
        </Stack>
      </VStack>

      {/* Credentials Save Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmSaveOpen && (
          <Box
            position="fixed"
            inset={0}
            bg="black/60"
            backdropFilter="blur(4px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            onClick={() => setIsConfirmSaveOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <VStack
                w={{ base: 'calc(100vw - 32px)', sm: '420px' }}
                maxW="420px"
                bg={{ base: 'white', _dark: '#131c26' }}
                borderWidth="1px"
                borderColor="border"
                borderRadius="2xl"
                p={{ base: 5, sm: 6 }}
                gap={5}
                shadow="2xl"
                align="stretch"
              >
                <HStack justify="space-between">
                  <Text fontWeight="extrabold" fontSize="md" color="fg">
                    Update API Credentials
                  </Text>
                  <Box
                    as="button"
                    onClick={() => setIsConfirmSaveOpen(false)}
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    fontSize="sm"
                    fontWeight="bold"
                    aria-label="Close dialog"
                  >
                    ✕
                  </Box>
                </HStack>

                <Text fontSize="sm" color="fg.muted">
                  Updating your API credentials will reconnect your Telegram session. A verification code will be sent to your registered phone number ({currentUser?.phone || currentAccount?.phone || 'your phone number'}).
                </Text>

                <Stack
                  direction={{ base: 'column-reverse', sm: 'row' }}
                  justify="flex-end"
                  gap={3}
                  align={{ base: 'stretch', sm: 'center' }}
                >
                  <Button
                    onClick={() => setIsConfirmSaveOpen(false)}
                    variant="outline"
                    borderColor="border"
                    color="fg.muted"
                    h="36px"
                    borderRadius="xl"
                    fontSize="xs"
                    fontWeight="bold"
                    _hover={{ bg: 'bg.hover' }}
                    w={{ base: '100%', sm: 'auto' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartCredentialsUpdate}
                    bg="primary"
                    color="white"
                    h="36px"
                    borderRadius="xl"
                    fontSize="xs"
                    fontWeight="bold"
                    _hover={{ filter: 'brightness(1.1)' }}
                    w={{ base: '100%', sm: 'auto' }}
                  >
                    Continue
                  </Button>
                </Stack>
              </VStack>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* Verification Dialog (OTP & 2FA) */}
      <AnimatePresence>
        {verificationStep !== 'idle' && (
          <Box
            position="fixed"
            inset={0}
            bg="black/60"
            backdropFilter="blur(4px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            onClick={handleCancelVerification}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <VStack
                w={{ base: 'calc(100vw - 32px)', sm: '400px' }}
                maxW="400px"
                bg={{ base: 'white', _dark: '#131c26' }}
                borderWidth="1px"
                borderColor="border"
                borderRadius="2xl"
                p={{ base: 5, sm: 6 }}
                gap={5}
                shadow="2xl"
                align="stretch"
                position="relative"
                overflow="hidden"
              >
                {/* Header */}
                <HStack justify="space-between">
                  <Text fontWeight="extrabold" fontSize="md" color="fg">
                    {verificationStep === 'code'
                      ? 'Verify Connection'
                      : verificationStep === 'password'
                        ? 'Enter 2FA Password'
                        : 'Success'}
                  </Text>
                  <Box
                    as="button"
                    onClick={handleCancelVerification}
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    fontSize="sm"
                    fontWeight="bold"
                    aria-label="Close dialog"
                  >
                    ✕
                  </Box>
                </HStack>

                {/* Loading overlay inside dialog */}
                {verificationLoading && (
                  <Center
                    position="absolute"
                    inset={0}
                    bg={{ base: 'white/80', _dark: '#131c26/80' }}
                    backdropFilter="blur(2px)"
                    zIndex={10}
                  >
                    <VStack gap={2}>
                      <Box
                        w={8}
                        h={8}
                        border="3px solid"
                        borderColor="primary/20"
                        borderTopColor="primary"
                        borderRadius="full"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      />
                      <Text fontSize="xs" fontWeight="bold" color="fg">
                        {verificationStep === 'code' ? 'Sending Code...' : 'Verifying...'}
                      </Text>
                    </VStack>
                  </Center>
                )}

                {/* Body Content */}
                {verificationStep === 'code' && (
                  <VStack align="stretch" gap={4}>
                    <Text fontSize="xs" color="fg.muted">
                      Enter the 5-digit verification code sent to your Telegram account or phone.
                    </Text>

                    <VStack align="stretch" gap={1.5}>
                      <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                        Verification Code
                      </Text>
                      <Input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value);
                          setVerificationError('');
                        }}
                        placeholder="Enter 5-digit code"
                        maxLength={5}
                        border="1px solid"
                        borderColor="border"
                        borderRadius="xl"
                        h="40px"
                        px={3}
                        fontSize="sm"
                        color="fg"
                        bg="transparent"
                        _focus={{
                          borderColor: 'primary',
                          ring: '1px',
                          ringColor: 'primary',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && verificationCode.length === 5) {
                            handleVerifyCode();
                          }
                        }}
                      />
                    </VStack>
                  </VStack>
                )}

                {verificationStep === 'password' && (
                  <VStack align="stretch" gap={4}>
                    <Text fontSize="xs" color="fg.muted">
                      Your account has 2FA enabled. Please enter your Telegram cloud password.
                    </Text>

                    <VStack align="stretch" gap={1.5}>
                      <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                        2FA Cloud Password
                      </Text>
                      <Input
                        type="password"
                        value={verificationPassword}
                        onChange={(e) => {
                          setVerificationPassword(e.target.value);
                          setVerificationError('');
                        }}
                        placeholder="Enter 2FA password"
                        border="1px solid"
                        borderColor="border"
                        borderRadius="xl"
                        h="40px"
                        px={3}
                        fontSize="sm"
                        color="fg"
                        bg="transparent"
                        _focus={{
                          borderColor: 'primary',
                          ring: '1px',
                          ringColor: 'primary',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && verificationPassword) {
                            handleVerifyPassword();
                          }
                        }}
                      />
                    </VStack>
                  </VStack>
                )}

                {verificationStep === 'success' && (
                  <VStack gap={4} py={4} align="center">
                    <Center
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="success.100"
                      color="success.400"
                      fontSize="2xl"
                      fontWeight="bold"
                    >
                      ✓
                    </Center>
                    <Text fontSize="sm" fontWeight="bold" color="fg">
                      Credentials saved and verified successfully!
                    </Text>
                  </VStack>
                )}

                {/* Error Banner */}
                {verificationError && (
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="error.500/10"
                    border="1px solid"
                    borderColor="error.500/30"
                  >
                    <Text fontSize="xs" fontWeight="bold" color="error.400">
                      {verificationError}
                    </Text>
                  </Box>
                )}

                {/* Actions */}
                {verificationStep !== 'success' && (
                  <Stack
                    direction={{ base: 'column-reverse', sm: 'row' }}
                    justify="flex-end"
                    gap={3}
                    align={{ base: 'stretch', sm: 'center' }}
                  >
                    <Button
                      onClick={handleCancelVerification}
                      variant="outline"
                      borderColor="border"
                      color="fg.muted"
                      h="36px"
                      borderRadius="xl"
                      fontSize="xs"
                      fontWeight="bold"
                      _hover={{ bg: 'bg.hover' }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        verificationStep === 'code'
                          ? handleVerifyCode
                          : handleVerifyPassword
                      }
                      bg="primary"
                      color="white"
                      h="36px"
                      borderRadius="xl"
                      fontSize="xs"
                      fontWeight="bold"
                      _hover={{ filter: 'brightness(1.1)' }}
                      disabled={
                        verificationStep === 'code'
                          ? verificationCode.length < 5
                          : !verificationPassword
                      }
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Verify
                    </Button>
                  </Stack>
                )}

                {verificationStep === 'success' && (
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    justify="flex-end"
                    align={{ base: 'stretch', sm: 'center' }}
                  >
                    <Button
                      onClick={() => setVerificationStep('idle')}
                      bg="primary"
                      color="white"
                      h="36px"
                      borderRadius="xl"
                      fontSize="xs"
                      fontWeight="bold"
                      _hover={{ filter: 'brightness(1.1)' }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Close
                    </Button>
                  </Stack>
                )}
              </VStack>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </VStack>
  );
};

// Copy Button component helper with temporary tooltip status
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="xs"
      onClick={handleCopy}
      variant="outline"
      borderColor={copied ? 'success.400' : 'border'}
      color={copied ? 'success.400' : 'fg.muted'}
      borderRadius="lg"
      _hover={{ bg: 'bg.hover' }}
      h="26px"
      fontSize="2xs"
      fontWeight="bold"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </Button>
  );
};
