'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#6C5CE7',
          colorBackground: '#12121A',
          colorText: '#FAFAFA',
          colorTextSecondary: '#A1A1AA',
          colorInputBackground: '#1A1A24',
          colorInputText: '#FAFAFA',
          colorInputBorder: '#2A2A3A',
          colorShimmer: '#6C5CE71A',
          borderRadius: '0.5rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        },
        elements: {
          rootBox: 'w-full',
          card: {
            background: 'rgba(18, 18, 26, 0.8)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            boxShadow:
              '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(108, 92, 231, 0.15)',
            padding: '2rem',
          },
          headerTitle: 'text-xl font-semibold text-white',
          headerSubtitle: 'text-sm text-text-secondary',
          socialButtonsBlockButton: {
            background: 'rgba(26, 26, 36, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '0.5rem',
            color: '#FAFAFA',
            '&:hover': {
              background: 'rgba(26, 26, 36, 1)',
              border: '1px solid rgba(108, 92, 231, 0.3)',
            },
          },
          socialButtonsBlockButtonText: 'text-sm font-medium',
          socialButtonsProviderIcon: 'w-5 h-5',
          dividerLine: 'bg-border',
          dividerText: 'text-text-tertiary text-xs',
          formFieldLabel: 'text-sm font-medium text-text-secondary',
          formFieldInput: {
            background: '#1A1A24',
            border: '1px solid #2A2A3A',
            borderRadius: '0.5rem',
            color: '#FAFAFA',
            fontSize: '0.875rem',
            '&:focus': {
              border: '1px solid #6C5CE7',
              boxShadow: '0 0 0 2px rgba(108, 92, 231, 0.15)',
            },
          },
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #6C5CE7 0%, #8B7CF7 100%)',
            borderRadius: '0.5rem',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: '500',
            '&:hover': {
              background: 'linear-gradient(135deg, #5A4BD6 0%, #7B6CE7 100%)',
            },
          },
          formFieldAction: 'text-sm text-accent hover:text-accent-hover',
          footerActionLink: 'text-sm text-accent hover:text-accent-hover',
          identityPreviewEditButton: 'text-accent hover:text-accent-hover',
          alert: 'bg-danger-subtle border border-danger/30 text-danger rounded-lg',
          alertText: 'text-sm',
        },
      }}
      signUpUrl="/sign-up"
      forceRedirectUrl="/dashboard"
    />
  );
}
