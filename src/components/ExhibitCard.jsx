import React from 'react';
import {
  Box,
  Image,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ExhibitCard = ({ exhibit }) => {
  return (
    <Box
      as={RouterLink}
      to={`/exhibits/${exhibit.id}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Image
        src={exhibit.mainImage || '/placeholder.jpg'}
        alt={exhibit.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <VStack p={4} align="stretch" spacing={2}>
        <HStack justify="space-between" align="flex-start">
          <Heading size="md" noOfLines={2}>
            {exhibit.title}
          </Heading>
          {exhibit.featured && (
            <Badge colorScheme="green" fontSize="sm">
              Избранное
            </Badge>
          )}
        </HStack>
        <Text noOfLines={3} color="gray.600">
          {exhibit.description}
        </Text>
      </VStack>
    </Box>
  );
};

export default ExhibitCard; 