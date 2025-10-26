import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#2a2a2a',
          color: '#dcddde',
          border: '1px solid #202225',
          borderRadius: '12px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#7289da',
            secondary: '#dcddde',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4654',
            secondary: '#dcddde',
          },
        },
      }}
    />
  );
};

export default Toast;

