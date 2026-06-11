import { useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@assets';
import { appStore } from '@appStore';
import { useLoginForm } from './hooks/useLoginForm';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES } from './const';

const LoginPage = () => {
  const { t } = useTranslation();
  const {
    form,
    step,
    setStep,
    isLoading,
    errors,
    handleCredentialsSubmit,
    handlePhoneSubmit,
    handleCodeSubmit,
    handlePasswordSubmit,
    handleBack,
    clearFieldError,
    dialCode,
    setDialCode,
    savedAccounts,
    handleSelectAccount,
    handleRemoveAccount,
  } = useLoginForm();

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const authError = appStore((state) => state.authError);
  const setAuthError = appStore((state) => state.setAuthError);

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        setAuthError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, setAuthError]);

  useEffect(() => {
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  return (
    <Center minH="calc(100vh - 4rem - 300px)" py={12} px={4}>
      <VStack gap={8} w="100%" maxW="460px">
        {/* Header Branding */}
        <VStack gap={2} textAlign="center">
          <Box w={12} h={12} mb={2}>
            <Logo size="100%" />
          </Box>
          <Heading
            size={{ base: 'md', sm: 'lg' }}
            fontWeight="extrabold"
            color="fg"
          >
            {t('LoginPage.title')}
          </Heading>
          <Text
            fontSize={{ base: '2xs', sm: 'xs' }}
            color="fg.muted"
            maxW="360px"
          >
            {t('LoginPage.subtitle')}
          </Text>
        </VStack>

        {/* Form Container Card */}
        <Box
          w="100%"
          bg="bg.panel"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="border"
          p={{ base: 4, sm: 6, md: 8 }}
          shadow="2xl"
          position="relative"
          overflow="hidden"
        >
          {/* Back Button */}
          {((step > 1 && step < 5) ||
            (step === 1 && savedAccounts.length > 0)) && (
            <IconButton
              onClick={handleBack}
              variant="ghost"
              size="xs"
              position="absolute"
              left={{ base: 4, md: 6 }}
              top={{ base: 4, md: 6 }}
              color="fg.muted"
              _hover={{ color: 'fg', bg: 'bg.subtle' }}
              zIndex={5}
              aria-label="Go Back"
              borderRadius="full"
            >
              <svg
                viewBox="0 0 6 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width="6"
                height="10"
                aria-hidden="true"
              >
                <path
                  d="M5 9L1 5l4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          )}

          {/* Loading Glassmorphic Overlay */}
          {isLoading && (
            <Center
              position="absolute"
              inset={0}
              bg="bg.panel/70"
              backdropFilter="blur(8px)"
              zIndex={10}
              style={{ animation: 'fade-in 0.2s ease-in-out' }}
            >
              <VStack gap={3}>
                <Box
                  w={10}
                  h={10}
                  border="4px solid"
                  borderColor="primary/20"
                  borderTopColor="primary"
                  borderRadius="full"
                  className="spinner-rotation"
                />
                <Text fontSize="sm" fontWeight="bold" color="fg">
                  {step === 2 || step === 0
                    ? t('LoginPage.loading')
                    : step === 3 || step === 4
                      ? t('LoginPage.verifying')
                      : t('LoginPage.loadingDefault')}
                </Text>
              </VStack>
            </Center>
          )}

          {/* Step Progress Stepper */}
          {step > 0 && (
            <HStack gap={{ base: 1.5, sm: 3, md: 4 }} justify="center" mb={8}>
              {[1, 2, 3, 4].map((s) => (
                <HStack key={s} gap={{ base: 1, md: 2 }} alignItems="center">
                  <Center
                    w={{ base: 6, md: 7 }}
                    h={{ base: 6, md: 7 }}
                    borderRadius="full"
                    bg={
                      step === s
                        ? 'primary'
                        : step > s
                          ? 'success.400'
                          : 'bg.subtle'
                    }
                    color={step >= s ? 'white' : 'fg.muted'}
                    fontSize={{ base: '2xs', md: 'xs' }}
                    fontWeight="bold"
                    borderWidth="1px"
                    borderColor={
                      step === s
                        ? 'primary'
                        : step > s
                          ? 'success.400'
                          : 'border'
                    }
                    transition="all 0.3s"
                  >
                    {step > s ? '✓' : s}
                  </Center>
                  {s < 4 && (
                    <Box
                      w={{ base: 3, sm: 6, md: 10 }}
                      h="2px"
                      bg={step > s ? 'success.400' : 'border'}
                      transition="all 0.3s"
                    />
                  )}
                </HStack>
              ))}
            </HStack>
          )}

          {/* Form Multistep Transitions */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <VStack gap={5} align="stretch">
                  <VStack align="start" gap={2}>
                    <Heading
                      size={{ base: 'xs', sm: 'xs' }}
                      fontWeight="bold"
                      color="fg"
                    >
                      {t('LoginPage.savedAccounts.title')}
                    </Heading>
                    <Text
                      fontSize={{ base: '10px', sm: '11px' }}
                      color="fg.muted"
                    >
                      {t('LoginPage.savedAccounts.description')}
                    </Text>
                  </VStack>

                  {/* Scrollable item list with overflow-visible so hover
                      transforms are never clipped by the container edge */}
                  <Box
                    maxH="240px"
                    overflowY="auto"
                    overflowX="visible"
                    pr={1}
                    py={2}
                  >
                    <VStack gap={3} align="stretch" pb={1}>
                      {savedAccounts.map((account) => (
                        <motion.div
                          key={account.phone}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          style={{ width: '100%' }}
                        >
                          <HStack
                            p={3}
                            bg="bg.subtle"
                            border="1px solid"
                            borderColor="border"
                            borderRadius="xl"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                              bg: 'bg.muted',
                              borderColor: 'primary',
                              transform: 'translateY(-1px)',
                              shadow: 'sm',
                            }}
                            onClick={() => handleSelectAccount(account)}
                            justify="space-between"
                          >
                            <HStack gap={3}>
                              <Center
                                w={9}
                                h={9}
                                borderRadius="full"
                                bgGradient="linear(to-br, primary, info)"
                                color="white"
                                fontWeight="bold"
                                fontSize="xs"
                              >
                                {account.phone.slice(-2)}
                              </Center>
                              <VStack align="start" gap={0}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="bold"
                                  color="fg"
                                >
                                  {account.phone}
                                </Text>
                                <Text fontSize="2xs" color="fg.muted">
                                  API ID: {account.apiId.slice(0, 3)}***
                                </Text>
                              </VStack>
                            </HStack>
                            <IconButton
                              aria-label="Remove Account"
                              variant="ghost"
                              size="xs"
                              color="error.400"
                              _hover={{
                                bg: 'error.100/10',
                                color: 'error.500',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveAccount(account.phone);
                              }}
                              borderRadius="full"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                width="14"
                                height="14"
                              >
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </IconButton>
                          </HStack>
                        </motion.div>
                      ))}
                    </VStack>
                  </Box>

                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="lg"
                    borderStyle="dashed"
                    borderColor="border"
                    borderRadius="xl"
                    fontWeight="bold"
                    _hover={{
                      borderColor: 'primary',
                      color: 'primary',
                      bg: 'transparent',
                    }}
                  >
                    + {t('LoginPage.savedAccounts.addNew')}
                  </Button>
                </VStack>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handlePhoneSubmit}>
                  <VStack gap={5} align="stretch">
                    <VStack align="start" gap={1}>
                      <Heading
                        size={{ base: 'xs' }}
                        fontWeight="bold"
                        color="fg"
                      >
                        {t('LoginPage.phone.title')}
                      </Heading>
                      <Text
                        fontSize={{ base: '10px', sm: '11px' }}
                        color="fg.muted"
                      >
                        {t('LoginPage.phone.description')}
                      </Text>
                    </VStack>

                    <form.Field
                      name="phone"
                      children={(field) => (
                        <VStack align="stretch" gap={1.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="fg.muted"
                          >
                            {t('LoginPage.phone.label')}
                          </Text>
                          <HStack gap={2}>
                            <Box
                              position="relative"
                              display="inline-flex"
                              alignItems="center"
                              h="48px"
                              px={{ base: 2, sm: 4 }}
                              bg="bg.panel"
                              borderRadius="xl"
                              border="1px solid"
                              borderColor="border"
                              _focusWithin={{
                                borderColor: 'primary',
                                ring: '1px',
                                ringColor: 'primary',
                              }}
                              w={{ base: '100px', sm: '130px' }}
                              flexShrink={0}
                            >
                              <select
                                aria-label="Select Country Code"
                                value={dialCode}
                                onChange={(e) => setDialCode(e.target.value)}
                                style={{
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  background: 'transparent',
                                  border: 'none',
                                  outline: 'none',
                                  width: '100%',
                                  height: '100%',
                                  fontSize: '14px',
                                  fontFamily: 'inherit',
                                  color: 'var(--chakra-colors-fg)',
                                  cursor: 'pointer',
                                  paddingRight: '18px',
                                }}
                              >
                                {COUNTRIES.map((c) => (
                                  <option
                                    key={`${c.code}-${c.dialCode}`}
                                    value={c.dialCode}
                                    style={{
                                      background:
                                        'var(--chakra-colors-bg-panel)',
                                      color: 'var(--chakra-colors-fg)',
                                    }}
                                  >
                                    {c.flag} {c.code} ({c.dialCode})
                                  </option>
                                ))}
                              </select>
                              <Box
                                position="absolute"
                                right={3}
                                pointerEvents="none"
                                color="fg.muted"
                                display="flex"
                                alignItems="center"
                              >
                                <svg
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  width="10"
                                  height="10"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M1 1l4 4 4-4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Box>
                            </Box>
                            <Input
                              placeholder={t('LoginPage.phone.placeholder')}
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                clearFieldError('phone');
                              }}
                              onBlur={field.handleBlur}
                              border="1px solid"
                              borderColor="border"
                              borderRadius="xl"
                              size="lg"
                              px={4}
                              _focus={{
                                borderColor: 'primary',
                                ring: '1px',
                                ringColor: 'primary',
                              }}
                              _placeholder={{
                                fontSize: 'xs',
                              }}
                            />
                          </HStack>
                          {errors.phone && (
                            <Text fontSize="2xs" color="error.400" mt={0.5}>
                              {errors.phone}
                            </Text>
                          )}
                        </VStack>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      bg="primary"
                      color="white"
                      borderRadius="xl"
                      fontWeight="bold"
                      mt={2}
                      _hover={{ bg: 'primary/90' }}
                    >
                      {t('LoginPage.phone.button')}
                    </Button>
                  </VStack>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleCredentialsSubmit}>
                  <VStack gap={5} align="stretch">
                    <VStack align="start" gap={1}>
                      <Heading
                        size={{ base: 'xs' }}
                        fontWeight="bold"
                        color="fg"
                      >
                        {t('LoginPage.api.title')}
                      </Heading>
                      <Text
                        fontSize={{ base: '10px', sm: '11px' }}
                        color="fg.muted"
                      >
                        {t('LoginPage.api.description')}
                      </Text>
                      <Link
                        href="https://telegramonic.com/docs/introduction"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize={{ base: '10px', sm: '11px' }}
                        color="primary"
                        fontWeight="semibold"
                        textDecoration="underline"
                        _hover={{ opacity: 0.9 }}
                        display="inline-block"
                      >
                        {t('LoginPage.api.help')}
                      </Link>
                    </VStack>

                    <form.Field
                      name="apiId"
                      children={(field) => (
                        <VStack align="stretch" gap={1.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="fg.muted"
                          >
                            {t('LoginPage.api.idLabel')}
                          </Text>
                          <Input
                            placeholder={t('LoginPage.api.idPlaceholder')}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              clearFieldError('apiId');
                            }}
                            onBlur={field.handleBlur}
                            border="1px solid"
                            borderColor="border"
                            borderRadius="xl"
                            size="lg"
                            px={4}
                            _focus={{
                              borderColor: 'primary',
                              ring: '1px',
                              ringColor: 'primary',
                            }}
                            _placeholder={{ fontSize: 'xs' }}
                          />
                          {errors.apiId && (
                            <Text fontSize="2xs" color="error.400" mt={0.5}>
                              {errors.apiId}
                            </Text>
                          )}
                        </VStack>
                      )}
                    />

                    <form.Field
                      name="apiHash"
                      children={(field) => (
                        <VStack align="stretch" gap={1.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="fg.muted"
                          >
                            {t('LoginPage.api.hashLabel')}
                          </Text>
                          <Input
                            placeholder={t('LoginPage.api.hashPlaceholder')}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              clearFieldError('apiHash');
                            }}
                            onBlur={field.handleBlur}
                            border="1px solid"
                            borderColor="border"
                            borderRadius="xl"
                            size="lg"
                            px={4}
                            _focus={{
                              borderColor: 'primary',
                              ring: '1px',
                              ringColor: 'primary',
                            }}
                            _placeholder={{ fontSize: 'xs' }}
                          />
                          {errors.apiHash && (
                            <Text fontSize="2xs" color="error.400" mt={0.5}>
                              {errors.apiHash}
                            </Text>
                          )}
                        </VStack>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      bg="primary"
                      color="white"
                      borderRadius="xl"
                      fontWeight="bold"
                      mt={2}
                      _hover={{ bg: 'primary/90' }}
                    >
                      {t('LoginPage.api.button')}
                    </Button>
                  </VStack>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleCodeSubmit}>
                  <VStack gap={5} align="stretch">
                    <VStack align="start" gap={1}>
                      <Heading
                        size={{ base: 'xs' }}
                        fontWeight="bold"
                        color="fg"
                      >
                        {t('LoginPage.code.title')}
                      </Heading>
                      <Text
                        fontSize={{ base: '10px', sm: '11px' }}
                        color="fg.muted"
                      >
                        {t('LoginPage.code.description')}
                      </Text>
                    </VStack>

                    <form.Field
                      name="code"
                      children={(field) => {
                        const codeValue = field.state.value || '';
                        const digits = [
                          codeValue[0] || '',
                          codeValue[1] || '',
                          codeValue[2] || '',
                          codeValue[3] || '',
                          codeValue[4] || '',
                        ];

                        const handleChange = (val: string, index: number) => {
                          const cleanVal = val.replace(/\D/g, '');
                          if (cleanVal.length > 1) {
                            const newCode = cleanVal.slice(0, 5);
                            field.handleChange(newCode);
                            clearFieldError('code');
                            const targetIndex = Math.min(newCode.length, 4);
                            otpRefs[targetIndex].current?.focus();
                            return;
                          }

                          const nextDigits = [...digits];
                          nextDigits[index] = cleanVal;
                          const nextCode = nextDigits.join('');
                          field.handleChange(nextCode);
                          clearFieldError('code');

                          if (cleanVal && index < 4) {
                            otpRefs[index + 1].current?.focus();
                          }
                        };

                        const handleKeyDown = (
                          e: React.KeyboardEvent<HTMLInputElement>,
                          index: number
                        ) => {
                          if (e.key === 'Backspace' && !digits[index] && index > 0) {
                            const nextDigits = [...digits];
                            nextDigits[index - 1] = '';
                            field.handleChange(nextDigits.join(''));
                            clearFieldError('code');
                            otpRefs[index - 1].current?.focus();
                          }
                        };

                        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData
                            .getData('text')
                            .replace(/\D/g, '')
                            .slice(0, 5);
                          field.handleChange(pastedText);
                          clearFieldError('code');
                          const targetIndex = Math.min(pastedText.length, 4);
                          otpRefs[targetIndex].current?.focus();
                        };

                        return (
                          <VStack align="stretch" gap={1.5}>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="fg.muted"
                            >
                              {t('LoginPage.code.label')}
                            </Text>
                            <HStack gap={3} justify="space-between" w="100%">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <Input
                                  key={i}
                                  ref={otpRefs[i]}
                                  value={digits[i]}
                                  onChange={(e) => handleChange(e.target.value, i)}
                                  onKeyDown={(e) => handleKeyDown(e, i)}
                                  onPaste={handlePaste}
                                  maxLength={1}
                                  textAlign="center"
                                  fontSize="xl"
                                  fontWeight="extrabold"
                                  h="56px"
                                  flex={1}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  border="1px solid"
                                  borderColor="border"
                                  borderRadius="xl"
                                  _focus={{
                                    borderColor: 'primary',
                                    ring: '1px',
                                    ringColor: 'primary',
                                  }}
                                />
                              ))}
                            </HStack>
                            {errors.code && (
                              <Text fontSize="2xs" color="error.400" mt={0.5}>
                                {errors.code}
                              </Text>
                            )}
                          </VStack>
                        );
                      }}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      bg="primary"
                      color="white"
                      borderRadius="xl"
                      fontWeight="bold"
                      mt={2}
                      _hover={{ bg: 'primary/90' }}
                    >
                      {t('LoginPage.code.button')}
                    </Button>
                  </VStack>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handlePasswordSubmit}>
                  <VStack gap={5} align="stretch">
                    <VStack align="start" gap={1}>
                      <Heading
                        size={{ base: 'xs' }}
                        fontWeight="bold"
                        color="fg"
                      >
                        {t('LoginPage.password.title')}
                      </Heading>
                      <Text
                        fontSize={{ base: '10px', sm: '11px' }}
                        color="fg.muted"
                      >
                        {t('LoginPage.password.description')}
                      </Text>
                    </VStack>

                    <form.Field
                      name="password"
                      children={(field) => (
                        <VStack align="stretch" gap={1.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="fg.muted"
                          >
                            {t('LoginPage.password.label')}
                          </Text>
                          <Input
                            type="password"
                            placeholder={t('LoginPage.password.placeholder')}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              clearFieldError('password');
                            }}
                            onBlur={field.handleBlur}
                            border="1px solid"
                            borderColor="border"
                            borderRadius="xl"
                            size="lg"
                            px={4}
                            _focus={{
                              borderColor: 'primary',
                              ring: '1px',
                              ringColor: 'primary',
                            }}
                          />
                          {errors.password && (
                            <Text fontSize="2xs" color="error.400" mt={0.5}>
                              {errors.password}
                            </Text>
                          )}
                        </VStack>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      bg="primary"
                      color="white"
                      borderRadius="xl"
                      fontWeight="bold"
                      mt={2}
                      _hover={{ bg: 'primary/90' }}
                    >
                      {t('LoginPage.password.button')}
                    </Button>
                  </VStack>
                </form>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VStack gap={5} textAlign="center" py={6}>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                  >
                    <Center
                      w={16}
                      h={16}
                      borderRadius="full"
                      bg="success.100"
                      color="success.400"
                      fontSize="3xl"
                      fontWeight="bold"
                      boxShadow="0 0 20px rgba(72, 187, 120, 0.4)"
                    >
                      ✓
                    </Center>
                  </motion.div>
                  <Heading
                    size={{ base: 'sm', md: 'md' }}
                    color="fg"
                    fontWeight="bold"
                  >
                    {t('LoginPage.successConfigured')}
                  </Heading>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color="fg.muted">
                    {t('LoginPage.redirecting')}
                  </Text>
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </VStack>

      {/* Custom Toast Notifications for Auth Errors */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              zIndex: 2000,
            }}
          >
            <HStack
              bg={{ base: 'white', _dark: '#18202a' }}
              borderWidth="1px"
              borderColor="error.400"
              borderRadius="xl"
              px={5}
              py={3.5}
              shadow="2xl"
              gap={3}
            >
              <Box w={2} h={2} borderRadius="full" bg="error.400" />
              <Text fontSize="sm" fontWeight="bold" color="fg">
                {authError}
              </Text>
            </HStack>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner-rotation {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </Center>
  );
};

export default LoginPage;
