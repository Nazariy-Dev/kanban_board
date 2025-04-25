import {useEffect, useCallback} from 'react'
import useStore from "../store/store.ts";
import Header from "../components/Header/Header.tsx";
import CanBanBoard from '../components/CanBanBoard.tsx';
import Links from "../components/Links.tsx";
import {Container, Heading, Spinner} from "@chakra-ui/react";
import {useSearchParams} from "react-router-dom";
import Pagination from "../components/Pagination.tsx";
import {rememberOrder, restoreOrder} from "../lib/functions.ts";


function App() {
    const {
        issues,
        boardItems,
        setBoardItems,
        issuesAreLoading,
        fetchIssues,
        issuesHaveMorePages: haveMorePages,
        issuesApiURL,
        issuesError,
        routeData,
        activeCard
    } = useStore(state => state)
    const [searchParams] = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1

    useEffect(() => {
        if (!routeData) return
        fetchIssues(routeData.owner.name, routeData.repo.name, currentPage)
    }, [currentPage, routeData]);

    useEffect(() => {
        const localStorageIssues = localStorage.getItem(issuesApiURL);
        let updatedIssues;
        if (!localStorageIssues) {
            updatedIssues = issues;
        } else {
            updatedIssues = restoreOrder(issues, JSON.parse(localStorageIssues));
        }

        setBoardItems(updatedIssues);
    }, [issues]);

    const onDrop = useCallback((type: string, position: number) => {
        if (activeCard == null || activeCard === undefined) return;

        // set correct position
        if (activeCard! < position) {
            position--
        }
        const issueToMove = boardItems[activeCard];
        const updatedItems = boardItems.filter((_, index) => index !== activeCard)

        updatedItems.splice(position, 0, {
            ...issueToMove, state: type
        });

        setBoardItems(updatedItems)
        rememberOrder(updatedItems, issuesApiURL)
    }, [activeCard, boardItems, issuesApiURL])

    return (
        <Container py={6} position="relative">
            <Header />
            {issuesAreLoading && !issuesError &&
                <Spinner position="absolute" top="40%" left={"50%"} translate="-50%, -50%" zIndex={10} mt={10} size="sm"
                         alignSelf="center"/>}

            {routeData && !issuesError ?
                <>
                    <Links/>
                    <CanBanBoard onDrop={onDrop}/>
                </> :
                !issuesError ? <Heading mt={10}>No issues yet, type repo URL above...</Heading> : ""
            }
            {issuesError && <Heading mt={10}>Repo with URL {routeData?.repo.url} is not found</Heading>}
            {(routeData || !haveMorePages) && !issuesError &&
                <Pagination currentPage={currentPage} haveMorePages={haveMorePages}></Pagination>}


        </Container>
    )
}

export default App
