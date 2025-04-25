import {Card, Flex, Icon, Text, Link} from "@chakra-ui/react";
import {IGithubIssue} from "../interfaces/IGitHubIssue.ts";
import React from "react";
import {FaExternalLinkAlt} from "react-icons/fa";
import moment from 'moment';
import useStore from "../store/store.ts";

interface Props {
    index: number,
    issue: IGithubIssue,
    draggable: boolean,
    dataTestId: string,
    dataPosition: string,
}

const BoardCard = ({index, issue, draggable = true, dataTestId, dataPosition}: Props) => {
   const {setActiveCard} = useStore(state => state)

    return (
        <Card.Root _hover={{cursor: "grab"}} _active={{opacity: .4}} p="4" draggable={draggable}
                   onDragStart={() => setActiveCard(index)}
                   onDragEnd={() => setActiveCard(null)}
                   data-testid={dataTestId}
                   data-position={dataPosition}>

            <Card.Title>{issue.title}</Card.Title>
            <Card.Description as={"div"}>
                <Flex flexDirection={"column"}>
                    <Flex gap="2">
                        <Text># {issue.number}</Text>
                        <Text>opened {moment(issue.created_at).fromNow()}</Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center" pt={2}>
                        Comments: {issue.comments}
                        <Link p={2} target={"_blank"} href={issue.html_url} cursor="pointer">
                            <Icon>
                                <FaExternalLinkAlt/>
                            </Icon>
                        </Link>
                    </Flex>
                </Flex>
            </Card.Description>
        </Card.Root>)
}


export default React.memo(BoardCard);
