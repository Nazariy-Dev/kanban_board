import {Button, Flex} from "@chakra-ui/react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {GrPrevious, GrNext} from "react-icons/gr";


function Pagination({currentPage, haveMorePages}: { currentPage: number, haveMorePages: boolean }) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const {pathname} = useLocation()


    const onButtonClick = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        navigate(`${pathname}?${params.toString()}`)
    }

    return (
        <Flex justifyContent="center" alignItems="center" gap={3} mt={2}>
            <Button size='md' onClick={() => onButtonClick(currentPage - 1)} variant="surface"
                    fontWeight="bold"  disabled={currentPage <= 1}>
                <GrPrevious/>
            </Button>
            <Button size='md' variant="surface" fontWeight="bold">{currentPage}</Button>
            <Button size='md' onClick={() => onButtonClick(currentPage + 1)} variant="surface"
                    fontWeight="bold"  disabled={!haveMorePages}>
                <GrNext/>
            </Button >
        </Flex>
    );
}

export default Pagination;
