import {Flex} from "@chakra-ui/react"
import {IGithubIssue} from "../interfaces/IGitHubIssue"
import IssuesColumn from "./BoardColumn.tsx"
import React, { SetStateAction} from "react";

interface Props {
    items: IGithubIssue[],
    setActiveCard: (index: SetStateAction<null | number>) => void,
    onDrop: (type: string, position: number) => void,
}

function CanBanBoard({items, setActiveCard, onDrop}: Props) {
    return (
        <>
            <Flex gap="6" mt="6" height="600px" overflowX={"auto"}>
                <IssuesColumn
                    type="open"
                    title="ToDo"
                    items={items}
                    typePredicate={(issue) => issue.state == "open"}
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                >

                </IssuesColumn>
                <IssuesColumn
                    type="closed"
                    title="Closed"
                    items={items}
                    typePredicate={(issue) => issue.state == "closed"}
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                >

                </IssuesColumn>
                <IssuesColumn
                    title="In Progress"
                    items={items}
                    typePredicate={(issue) => issue.state == "open" && issue.assignees.length > 0}
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    type="inProgress"
                >
                </IssuesColumn>
            </Flex>
        </>
    )
}

export default React.memo(CanBanBoard)
