import React, { useState } from 'react';
import { 
    Box,
    Container,
    Grid,
} from '@material-ui/core';

export default function About() {

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box component="span" display="block" p={1} m={1} bgcolor="background.paper" >
                        <h4>
                            <div style={{textAlign:'center'}}>
                                Testing 123
                            </div>
                        </h4>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}