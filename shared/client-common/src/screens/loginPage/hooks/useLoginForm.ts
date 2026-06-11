import { useState, useEffect, type FormEvent } from 'react';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appStore } from '@appStore';
import { apiClient } from '@services';
import { LoginFormValues, SavedAccount } from '../types';

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const savedAccounts = appStore((state) => state.savedAccounts);
  const saveAccount = appStore((state) => state.saveAccount);
  const removeAccount = appStore((state) => state.removeAccount);
  const setCurrentAccount = appStore((state) => state.setCurrentAccount);

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(() => {
    const storedAccounts = appStore.getState().savedAccounts;
    if (storedAccounts && storedAccounts.length > 0) {
      return 0;
    }
    return 1;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialCode, setDialCode] = useState('+91');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');

  const form = useForm({
    defaultValues: {
      phone: '',
      code: '',
      apiId: '',
      apiHash: '',
    } as LoginFormValues,
  });

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const phone = form.getFieldValue('phone');

    const newErrors: Record<string, string> = {};
    if (!phone) newErrors.phone = t('LoginPage.phone.errorEmpty');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullPhoneNumber = phone.startsWith('+')
      ? phone
      : `${dialCode}${phone}`;
    setCurrentPhone(fullPhoneNumber);
    setErrors({});
    setStep(2);
  };

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const apiId = form.getFieldValue('apiId');
    const apiHash = form.getFieldValue('apiHash');

    const newErrors: Record<string, string> = {};
    if (!apiId) newErrors.apiId = t('LoginPage.api.idError');
    if (!apiHash) newErrors.apiHash = t('LoginPage.api.hashError');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiClient.sendCode(currentPhone, apiId, apiHash);
      if (res.success) {
        setPhoneCodeHash(res.next_step || 'mock_hash');
        setStep(3);
      } else {
        setErrors({ apiId: res.error || t('LoginPage.api.errorSendCode') });
      }
    } catch (err: any) {
      setErrors({ apiId: err.message || t('LoginPage.errors.serverConnection') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = async (account: SavedAccount) => {
    form.setFieldValue('phone', account.phone);
    form.setFieldValue('apiId', account.apiId);
    form.setFieldValue('apiHash', account.apiHash);
    setCurrentPhone(account.phone);
    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiClient.sendCode(account.phone, account.apiId, account.apiHash);
      if (res.success) {
        setPhoneCodeHash(res.next_step || 'mock_hash');
        setStep(3);
      } else {
        setErrors({ apiId: res.error || t('LoginPage.api.errorSendCode') });
        setStep(2);
      }
    } catch (err: any) {
      setErrors({ apiId: err.message || t('LoginPage.errors.serverConnection') });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccount = (phone: string) => {
    removeAccount(phone);
    const updated = appStore.getState().savedAccounts;
    if (updated.length === 0 && step === 0) {
      setStep(1);
    }
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = form.getFieldValue('code');
    const apiId = form.getFieldValue('apiId');
    const apiHash = form.getFieldValue('apiHash');

    if (!value) {
      setErrors((prev) => ({ ...prev, code: t('LoginPage.code.errorEmpty') }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiClient.signIn(currentPhone, value, phoneCodeHash);
      if (res.success) {
        // Save account and set as active current account on successful sign in
        saveAccount(currentPhone, apiId, apiHash);
        setCurrentAccount({ phone: currentPhone, apiId, apiHash });

        setStep(4);
      } else {
        setErrors({ code: res.error || t('LoginPage.errors.invalidCode') });
      }
    } catch (err: any) {
      setErrors({ code: err.message || t('LoginPage.errors.verificationFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      if (savedAccounts.length > 0) {
        setStep(0);
      }
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const clearFieldError = (fieldName: keyof LoginFormValues) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  return {
    form,
    step,
    setStep,
    isLoading,
    isSuccess: step === 4,
    errors,
    setErrors,
    handleCredentialsSubmit,
    handlePhoneSubmit,
    handleCodeSubmit,
    handleBack,
    clearFieldError,
    dialCode,
    setDialCode,
    savedAccounts,
    handleSelectAccount,
    handleRemoveAccount,
  };
};
