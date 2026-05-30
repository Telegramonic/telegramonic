import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appStore, selectApiCredentials, useShallow } from '@appStore';

export interface LoginFormValues {
  phone: string;
  code: string;
  apiId: string;
  apiHash: string;
}

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialCode, setDialCode] = useState('+1');
  const { setApiCredentials } = appStore(useShallow(selectApiCredentials));

  const form = useForm({
    defaultValues: {
      phone: '',
      code: '',
      apiId: '',
      apiHash: '',
    } as LoginFormValues,
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = form.getFieldValue('phone');
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        phone: t('LoginPage.phone.errorEmpty'),
      }));
      return;
    }

    const fullPhoneNumber = value.startsWith('+')
      ? value
      : `${dialCode}${value}`;
    console.log('MTProto connecting with phone:', fullPhoneNumber);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = form.getFieldValue('code');
    if (!value) {
      setErrors((prev) => ({ ...prev, code: t('LoginPage.code.errorEmpty') }));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiId = form.getFieldValue('apiId');
    const apiHash = form.getFieldValue('apiHash');
    const newErrors: Record<string, string> = {};

    if (!apiId) {
      newErrors.apiId = t('LoginPage.api.idError');
    }

    if (!apiHash) {
      newErrors.apiHash = t('LoginPage.api.hashError');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setApiCredentials(apiId, apiHash);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1500);
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
    isSuccess,
    errors,
    setErrors,
    handlePhoneSubmit,
    handleCodeSubmit,
    handleFinalSubmit,
    clearFieldError,
    dialCode,
    setDialCode,
  };
};
