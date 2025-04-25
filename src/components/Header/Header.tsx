import {FormEvent, useRef, useState} from 'react';
import Search from "../Search.tsx";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import useStore from '../../store/store.ts';
import {getRouteData} from "../../lib/functions.ts";
import {useSearchParams} from "react-router-dom";
import {ColorModeButton} from "../ui/color-mode.tsx";


const githubRepoRegex = /^(https:\/\/github\.com\/[\w-]+\/[\w-]+(?:\.git)?)$|^(git@github\.com:[\w-]+\/[\w-]+\.git)$/;


function Header() {
    const [urlIsValid, setUrlIsValid] = useState(true)
    const searchField = useRef<HTMLInputElement>(null)
    const {fetchIssues, setRouteData} = useStore(state => state)
    const [searchParams] = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1


    const onSubmit = (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!searchField.current || searchField.current.value.length == 0) return
        const value = searchField.current.value
        const urlIsValid = githubRepoRegex.test(value)

        if (!urlIsValid) {
            setUrlIsValid(false)
        } else {
            setUrlIsValid(true)
            const {owner, repo} = getRouteData(value)
            setRouteData({owner, repo})
            fetchIssues(owner.name, repo.name, currentPage)
        }
    }

    return (
        <Box as="header" mb="3">
            <Box as="form" onSubmit={onSubmit}>
                <Flex gap={4} alignItems="center">
                    <Search searchFieldRef={searchField}/>
                    <Button type={"submit"} colorPalette="cyan">Search</Button>
                    <ColorModeButton/>
                </Flex>
                {!urlIsValid &&
                    <Text textAlign="start" mt={2} ml={1} color="fg.error" fontSize="sm">Url is not valid</Text>}
            </Box>
        </Box>
    );
}

export default Header;
