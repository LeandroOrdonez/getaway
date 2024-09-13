// frontend/src/components/Carousel.js
import React from 'react';
import { Dialog, Flex, Button, Text } from '@radix-ui/themes';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Carousel = ({ images, currentIndex, onClose, onPrev, onNext }) => (
  <Dialog.Root open={true} onOpenChange={onClose}>
    <Dialog.Content style={{ 
      maxWidth: '90vw', 
      width: '90vw', 
      height: '90vh', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden' // Prevent any overflow
    }}>
      <Flex justify="between" align="center" mb="2">
        <Text size="5">Image Gallery</Text>
        <Dialog.Close>
          <Button variant="ghost" size="1">
            <X size={24} />
          </Button>
        </Dialog.Close>
      </Flex>
      <Flex grow="1" align="center" justify="center" style={{ position: 'relative', overflow: 'hidden' }}>
        <Button 
          variant="ghost" 
          size="3" 
          onClick={onPrev}
          style={{ position: 'absolute', left: 10, zIndex: 10 }}
        >
          <ChevronLeft size={24} />
        </Button>
        <div style={{ 
          height: '100%', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden' // Ensure no overflow within this container
        }}>
          <img 
            src={images[currentIndex]} 
            alt={`Accommodation ${currentIndex + 1}`}
            style={{
              maxHeight: 'calc(90vh - 100px)', // Adjust based on header and footer height
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <Button 
          variant="ghost" 
          size="3" 
          onClick={onNext}
          style={{ position: 'absolute', right: 10, zIndex: 10 }}
        >
          <ChevronRight size={24} />
        </Button>
      </Flex>
      <Text align="center" mt="2">{currentIndex + 1} / {images.length}</Text>
    </Dialog.Content>
  </Dialog.Root>
);

export default Carousel;