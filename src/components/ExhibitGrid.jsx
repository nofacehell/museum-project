import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import ExhibitCard from './ExhibitCard';

const ExhibitGrid = ({ exhibits }) => {
  return (
    <Grid
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
      gap={6}
    >
      {exhibits.map((exhibit) => (
        <GridItem key={exhibit.id}>
          <ExhibitCard exhibit={exhibit} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default ExhibitGrid; 