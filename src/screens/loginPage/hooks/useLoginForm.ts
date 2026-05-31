import React, { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appStore, selectApiCredentials, useShallow } from '@appStore';
import { apiClient } from '@services';

export interface LoginFormValues {
  phone: string;
  code: string;
  apiId: string;
  apiHash: string;
}

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialCode, setDialCode] = useState('+1');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const { setApiCredentials } = appStore(useShallow(selectApiCredentials));

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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
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

    setErrors({});
    setStep(2);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.getFieldValue('phone');
    const apiId = form.getFieldValue('apiId');
    const apiHash = form.getFieldValue('apiHash');
    
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
    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiClient.sendCode(fullPhoneNumber, apiId, apiHash);
      if (res.success) {
        setPhoneCodeHash(res.next_step || 'mock_hash');
        setStep(3);
      } else {
        setErrors({ phone: res.error || 'Failed to send code' });
      }
    } catch (err: any) {
      setErrors({ phone: err.message || 'Server connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
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
        setApiCredentials(apiId, apiHash);
        setStep(4);
      } else {
        setErrors({ code: res.error || 'Invalid code' });
      }
    } catch (err: any) {
      setErrors({ code: err.message || 'Verification failed' });
    } finally {
      setIsLoading(false);
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
    clearFieldError,
    dialCode,
    setDialCode,
  };
};
