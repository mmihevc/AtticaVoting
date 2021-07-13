import React from 'react';
import {Typography, Box} from "@material-ui/core";

function Home() {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Typography variant={'h3'}> Welcome to Attica Voting, this is our 404 page!</Typography>
        </Box>
    )
}

export default Home