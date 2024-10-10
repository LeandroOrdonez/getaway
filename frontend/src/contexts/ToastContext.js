// src/contexts/ToastContext.js
import React, { createContext, useState, useContext } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { styled } from '@stitches/react';

const ToastContext = createContext();

const ToastViewport = styled(Toast.Viewport, {
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '25px',
  gap: '10px',
  width: '390px',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
  outline: 'none',
});

const ToastRoot = styled(Toast.Root, {
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  padding: '15px',
  display: 'grid',
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: 'auto max-content',
  columnGap: '15px',
  alignItems: 'center',

  '&[data-state="open"]': {
    animation: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  '&[data-state="closed"]': {
    animation: 'hide 100ms ease-in',
  },
  '&[data-swipe="move"]': {
    transform: 'translateX(var(--radix-toast-swipe-move-x))',
  },
  '&[data-swipe="cancel"]': {
    transform: 'translateX(0)',
    transition: 'transform 200ms ease-out',
  },
  '&[data-swipe="end"]': {
    animation: 'swipeOut 100ms ease-out',
  },
});

const ToastTitle = styled(Toast.Title, {
  gridArea: 'title',
  marginBottom: '5px',
  fontWeight: 500,
  color: 'var(--slate-12)',
  fontSize: '15px',
});

const ToastDescription = styled(Toast.Description, {
  gridArea: 'description',
  margin: 0,
  color: 'var(--slate-11)',
  fontSize: '13px',
  lineHeight: '1.3',
});

const ToastAction = styled(Toast.Action, {
  gridArea: 'action',
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, description, type = 'info') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        {toasts.map((toast) => (
          <ToastRoot key={toast.id}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </ToastRoot>
        ))}
        <ToastViewport />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);