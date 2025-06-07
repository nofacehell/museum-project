import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';

const ExhibitGallery = ({ mainImage, additionalImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const allImages = [mainImage, ...additionalImages].filter(Boolean);

  const handlePrevious = (e) => {
    e && e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e && e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    onOpen();
  };

  return (
    <Box>
      {/* Основное изображение */}
      <Box 
        position="relative" 
        width="100%" 
        height="400px" 
        mb={4}
        cursor="pointer"
        onClick={() => allImages.length > 0 && onOpen()}
      >
        <Image
          src={allImages[currentImageIndex] || '/placeholder.jpg'}
          alt="Exhibit"
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="md"
        />
        {allImages.length > 1 && (
          <>
            {/* Стрелки для перелистывания */}
            <IconButton
              icon={<ChevronLeftIcon />}
              position="absolute"
              left={2}
              top="50%"
              transform="translateY(-50%)"
              onClick={handlePrevious}
              colorScheme="blackAlpha"
              aria-label="Previous"
              zIndex={2}
            />
            <IconButton
              icon={<ChevronRightIcon />}
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              onClick={handleNext}
              colorScheme="blackAlpha"
              aria-label="Next"
              zIndex={2}
            />
            <Box
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              bg="blackAlpha.600"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              zIndex={1}
            >
              {currentImageIndex + 1} / {allImages.length}
            </Box>
          </>
        )}
      </Box>

      {/* Миниатюры */}
      {allImages.length > 1 && (
        <Box display="flex" gap={2} overflowX="auto" pb={2}>
          {allImages.map((image, index) => (
            <Box
              key={index}
              width="80px"
              height="80px"
              flexShrink={0}
              cursor="pointer"
              onClick={() => setCurrentImageIndex(index)}
              border="2px solid"
              borderColor={currentImageIndex === index ? 'blue.500' : 'transparent'}
              borderRadius="md"
              overflow="hidden"
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Модальное окно для просмотра */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody p={0} position="relative">
            <IconButton
              icon={<CloseIcon />}
              position="absolute"
              top={2}
              right={2}
              onClick={onClose}
              colorScheme="blackAlpha"
              aria-label="Close"
            />
            <Box position="relative" width="100%" height="80vh">
              <Image
                src={allImages[currentImageIndex]}
                alt="Exhibit"
                objectFit="contain"
                width="100%"
                height="100%"
              />
              {allImages.length > 1 && (
                <>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    position="absolute"
                    left={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handlePrevious}
                    colorScheme="blackAlpha"
                    aria-label="Previous"
                  />
                  <IconButton
                    icon={<ChevronRightIcon />}
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handleNext}
                    colorScheme="blackAlpha"
                    aria-label="Next"
                  />
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExhibitGallery; 