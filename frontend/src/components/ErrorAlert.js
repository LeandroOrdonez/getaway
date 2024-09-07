import React from 'react';
import { AlertDialog, Flex, Button, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const ErrorAlert = ({ open, message, onClose }) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Title>
          <Flex align="center" gap="2">
            <ExclamationTriangleIcon color="red" />
            <Text size="5" weight="bold">Error</Text>
          </Flex>
        </AlertDialog.Title>
        <AlertDialog.Description size="2">
          {message}
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={onClose}>
              Close
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ErrorAlert;