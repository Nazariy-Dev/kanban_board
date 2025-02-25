import {Input} from "@chakra-ui/react";

interface Props {
    searchFieldRef: React.RefObject<HTMLInputElement | null>
}

function Search({searchFieldRef}: Props) {
    return (
        <Input ref={searchFieldRef} flexGrow="1" placeholder="Enter repo URL"
               variant="outline"/>
    );
}

export default Search;
