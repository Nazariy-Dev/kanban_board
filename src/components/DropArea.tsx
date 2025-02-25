import {useState} from 'react';
import {Box} from "@chakra-ui/react";

interface Props {
    onDrop: () => void;
    dataTestId: string
}

function DropArea({onDrop,dataTestId}: Props) {
    const [showDrop, setShowDrop] = useState(false)
    return (
        <Box data-testid={dataTestId} h={showDrop ? "40px" : 0} w="100%" textAlign="center" alignItems="center" justifyContent="center"
             borderRadius="lg" display="flex" my='2' border="1px dashed" borderColor="#dcdcdc" color="#dcdcdc"
             onDragEnter={() => {setShowDrop(true)}}
             onDragLeave={() => {setShowDrop(false)}}
             onDrop={() => {
                 onDrop()
                 setShowDrop(false)
             }}
             onDragOver={e => e.preventDefault()}
             opacity={showDrop ? 1 : 0}
             transition="all .3s ease"
        >
            Drop here
        </Box>
    );
}

export default DropArea;
