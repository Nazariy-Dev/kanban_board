import {Box, Flex, Icon, Link, Spacer, Spinner, Text} from "@chakra-ui/react";
import {FaStar} from "react-icons/fa";
import {capitalizeFirstLetter} from "../lib/functions.ts";
import useStore from "../store/store.ts";
import {useEffect} from "react";


function Links() {
    const {repo, fetchRepo, routeData} = useStore(state => state);

    useEffect(() => {
        if (!routeData) return
        fetchRepo(routeData.owner.name, routeData.repo.name)
    }, []);
    const repository = routeData?.repo
    const owner = routeData?.owner

    return (
        <Flex alignItems="center" justifyContent="start" ml={1}>
            <Link color="teal"  _dark={{color: "teal.400"}} href={owner?.url}>{capitalizeFirstLetter(owner!.name)}</Link>
            <Box mx='2' as={"span"}>{">"}</Box>
            <Link color="teal" _dark={{color: "teal.400"}} href={repository?.url}>{capitalizeFirstLetter(repository!.name)}</Link>

            {repo?.stargazers_count ?
                <>
                    <Icon color="yellow.500" fontSize="20px" ml="6">
                        <FaStar/>
                    </Icon>
                    <Text ml='2' fontWeight="bold">
                        {repo.stargazers_count} stars
                    </Text>
                    <Spacer/>
                </>
                :
                <Spinner ml={2} size="sm" display="flex"/>}
        </Flex>
    );
}

export default Links;
