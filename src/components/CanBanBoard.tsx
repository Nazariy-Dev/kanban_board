import {Flex} from "@chakra-ui/react"
import useStore from "../store/store.ts";
import IssuesColumn from "./BoardColumn.tsx"
import React from "react";

interface Props {
    onDrop: (type: string, position: number) => void,
}

function CanBanBoard({onDrop}: Props) {
    const {boardItems} = useStore(state => state)

    return (
        <>
            <Flex gap="6" mt="6" height="600px" overflowX={"auto"}>
                <IssuesColumn
                    type="open"
                    title="ToDo"
                    items={boardItems}
                    typePredicate={(issue) => issue.state == "open"}
                    onDrop={onDrop}
                >

                </IssuesColumn>
                <IssuesColumn
                    type="closed"
                    title="Closed"
                    items={boardItems}
                    typePredicate={(issue) => issue.state == "closed"}
                    onDrop={onDrop}
                >

                </IssuesColumn>
                <IssuesColumn
                    title="In Progress"
                    items={boardItems}
                    typePredicate={(issue) => issue.state == "open" && issue.assignees.length > 0}
                    onDrop={onDrop}
                    type="inProgress"
                >
                </IssuesColumn>
            </Flex>
        </>
    )
}

export default React.memo(CanBanBoard)
