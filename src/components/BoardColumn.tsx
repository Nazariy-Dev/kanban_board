import BoardCard from "./BoardCard.tsx";
import DropArea from "./DropArea.tsx";
import {IGithubIssue} from "../interfaces/IGitHubIssue.ts";
import {Box, Flex, Heading} from "@chakra-ui/react";
import {SetStateAction} from "react";

interface Props {
    title: string;
    type: string;
    items: IGithubIssue[]
    typePredicate: (issue: IGithubIssue) => boolean
    setActiveCard: (index: SetStateAction<null | number>) => void,
    onDrop: (type: string, position: number) => void,
}

const BoardColumn = (props: Props) => {
    const {
        title,
        items,
        typePredicate,
        setActiveCard,
        onDrop,
        type
    } = props;

    return (
        <Flex _scrollbar={{display: "none"}} flexDirection="column" flexBasis="33%" overflow="auto"
              justifyContent="start" minWidth={"225px"}>
            <Heading pb={1} position={"sticky"} top={0} style={{backdropFilter: "blur(2px)",}} zIndex={"10"}
                     bg={"rgba(255,255,255, .8)"} _dark={{bg: "rgba(0,0,0, .8)"}} textAlign={"center"}
                     mb={type == "inProgress" ? '18px' : 0} textDecoration="underline">{title}</Heading>

            <Flex flexDirection="column" gap={type == "inProgress" ? 5 : 0}>
                {type != "inProgress" &&
                    <DropArea
                        dataTestId={`drop-area-item-${type}-0`}
                        onDrop={() => onDrop(type, 0)}/>
                }

                {items.map((issue, index) =>
                    typePredicate(issue) &&
                    <Box key={issue.id}>
                        <BoardCard
                            dataTestId={`issue-item-${issue.number}`}
                            dataPosition={`${type}-${index}`}
                            draggable={type != "inProgress"}
                            // key={issue.id}
                            issue={issue}
                            index={index}
                            setActiveCard={setActiveCard}
                        />
                        {type != "inProgress" &&
                            <DropArea
                                onDrop={() => onDrop(type, index + 1)}
                                dataTestId={`drop-area-item-${type}-${index + 1}`}
                            />}
                    </Box>
                )}
            </Flex>

        </Flex>
    );
};

export default BoardColumn;
