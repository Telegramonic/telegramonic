import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@assets';
import { useLoginForm } from './hooks/useLoginForm';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES } from './const';

const LoginPage = () => {
  const { t } = useTranslation();
  const {
    form,
    step,
    isLoading,
    errors,
    handleCredentialsSubmit,
    handlePhoneSubmit,
    handleCodeSubmit,
    handleBack,
    clearFieldError,
    dialCode,
    setDialCode,
  } = useLoginForm();

  return (
    <Center minH="calc(100vh - 4rem - 300px)" py={12} px={4}>
      <VStack gap={8} w="100%" maxW="460px">
        {/* Header Branding */}
        <VStack gap={2} textAlign="center">
          <Box w={12} h={12} mb={2}>
            <Logo size="100%" />
          </Box>
          <Heading size="lg" fontWeight="extrabold" color="fg">
            {t('LoginPage.title')}
          </Heading>
          <Text fontSize="xs" color="fg.muted" maxW="360px">
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
          p={{ base: 6, md: 8 }}
          shadow="2xl"
          position="relative"
          overflow="hidden"
        >
          {/* Back Button */}
          {step > 1 && step < 4 && (
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
                  {step === 2
                    ? t('LoginPage.loading')
                    : step === 3
                      ? 'Verifying...'
                      : 'Loading...'}
                </Text>
              </VStack>
            </Center>
          )}

          {/* Step Progress Stepper */}
          <HStack gap={4} justify="center" mb={8}>
            {[1, 2, 3, 4].map((s) => (
              <HStack key={s} gap={2} alignItems="center">
                <Center
                  w={7}
                  h={7}
                  borderRadius="full"
                  bg={
                    step === s
                      ? 'primary'
                      : step > s
                        ? 'success.400'
                        : 'bg.subtle'
                  }
                  color={step >= s ? 'white' : 'fg.muted'}
                  fontSize="xs"
                  fontWeight="bold"
                  borderWidth="1px"
                  borderColor={
                    step === s ? 'primary' : step > s ? 'success.400' : 'border'
                  }
                  transition="all 0.3s"
                >
                  {step > s ? '✓' : s}
                </Center>
                {s < 4 && (
                  <Box
                    w={10}
                    h="2px"
                    bg={step > s ? 'success.400' : 'border'}
                    transition="all 0.3s"
                  />
                )}
              </HStack>
            ))}
          </HStack>

          {/* Form Multistep Transitions */}
          <AnimatePresence mode="wait">
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
                      <Heading size="xs" fontWeight="bold" color="fg">
                        {t('LoginPage.phone.title')}
                      </Heading>
                      <Text fontSize="11px" color="fg.muted">
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
                              px={4}
                              bg="bg.panel"
                              borderRadius="xl"
                              border="1px solid"
                              borderColor="border"
                              _focusWithin={{
                                borderColor: 'primary',
                                ring: '1px',
                                ringColor: 'primary',
                              }}
                              w="130px"
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
                      <Heading size="xs" fontWeight="bold" color="fg">
                        {t('LoginPage.api.title')}
                      </Heading>
                      <Text fontSize="11px" color="fg.muted">
                        {t('LoginPage.api.description')}
                      </Text>
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
                      <Heading size="xs" fontWeight="bold" color="fg">
                        {t('LoginPage.code.title')}
                      </Heading>
                      <Text fontSize="11px" color="fg.muted">
                        {t('LoginPage.code.description')}
                      </Text>
                    </VStack>

                    <form.Field
                      name="code"
                      children={(field) => (
                        <VStack align="stretch" gap={1.5}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="fg.muted"
                          >
                            {t('LoginPage.code.label')}
                          </Text>
                          <Input
                            placeholder={t('LoginPage.code.placeholder')}
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              clearFieldError('code');
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
                          {errors.code && (
                            <Text fontSize="2xs" color="error.400" mt={0.5}>
                              {errors.code}
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
                      {t('LoginPage.code.button')}
                    </Button>
                  </VStack>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
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
                  <Heading size="md" color="fg" fontWeight="bold">
                    {t('LoginPage.successConfigured')}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    {t('LoginPage.redirecting')}
                  </Text>
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </VStack>

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
