import {cleanup, fireEvent, render, screen} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import App from "../App.tsx";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "../../components/ui/provider.tsx";
import mockedResponse from "./mockedResponse.json";

// Mock Octokit
vi.mock("octokit", () => {
    return {
        Octokit: vi.fn().mockImplementation(() => ({
            request: vi.fn().mockImplementation((url) => {
                if (url.startsWith("GET /repos/")) {
                    return Promise.resolve({
                        headers: {link: null},
                        data: mockedResponse,
                    });
                }
                return Promise.reject(new Error("API Error"));
            }),
        })),
    };
});

const MockedApp = () => {
    return <Provider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>

}

const fireSeachAction = ()=>{
    const inputElement = screen.getByPlaceholderText("Enter repo URL");
    const buttonElement = screen.getByRole("button", {name: /Search/i});

    // Simulate the search interaction
    fireEvent.change(inputElement, {target: {value: "https://github.com/facebook/react"}});
    fireEvent.click(buttonElement);
}

describe("App component tests", () => {
    beforeEach(() => {
        cleanup();
        render(<MockedApp/>);
        fireSeachAction()
    });

    describe("render elements test", () => {

        it("shows correct issues length when URL is valid", async () => {
            const issuesElement = await screen.findAllByTestId(/issue-item/i)
            expect(issuesElement.length).toBe(31)
        })

        it("element with id 32463 is present in the document", async () => {
            const firstElement = screen.getByText(/32463/i)
            expect(firstElement).toBeInTheDocument()
        })
        //

        //
        // describe("order preservation between searches test", () => {
        //
        // })
    })
    describe("drag and drop tests", () => {
        it("element changes row order after drag and drop higher", () => {
            const secondElement = screen.getByTestId("issue-item-32449")
            const firstDropArea = screen.getByTestId("drop-area-item-open-0")
            fireEvent.dragStart(secondElement)

            fireEvent.dragEnter(firstDropArea)
            fireEvent.drop(firstDropArea)


            const secondElement1 = screen.getByTestId("issue-item-32449")
            expect(secondElement1.dataset.position).toBe("open-0")
        })
        it("element changes row order after drag and drop lower", () => {
            const secondElement = screen.getByTestId("issue-item-32449")
            const thirdDropArea = screen.getByTestId("drop-area-item-open-7")

            fireEvent.dragStart(secondElement)
            fireEvent.dragEnter(thirdDropArea)
            fireEvent.drop(thirdDropArea)

            const secondElement1 = screen.getByTestId("issue-item-32449")
            expect(secondElement1.dataset.position).toBe("open-6")
        })
        it("element changes order column order after drag and drop", () => {

            const secondElement = screen.getByTestId("issue-item-32449")
            const firstDropAreaClosed = screen.getByTestId("drop-area-item-closed-0")

            fireEvent.dragStart(secondElement)
            fireEvent.dragEnter(firstDropAreaClosed)
            fireEvent.drop(firstDropAreaClosed)

            const secondElement1 = screen.getByTestId("issue-item-32449")
            expect(secondElement1.dataset.position).toBe("closed-0")
        })
    })
    describe("order preservation tests between searches", ()=>{
        it('preserves order in column between searches', () => {
            const secondElement = screen.getByTestId("issue-item-32449")
            const firstDropAreaClosed = screen.getByTestId("drop-area-item-closed-0")

            fireEvent.dragStart(secondElement)
            fireEvent.dragEnter(firstDropAreaClosed)
            fireEvent.drop(firstDropAreaClosed)

            fireSeachAction()
            const secondElement1= screen.getByTestId("issue-item-32449")
            expect(secondElement1.dataset.position).toBe("closed-0")
        });

        it('preserves order in rows between searches', () => {
            const secondElement = screen.getByTestId("issue-item-32449")
            const thirdDropArea = screen.getByTestId("drop-area-item-open-7")

            fireEvent.dragStart(secondElement)
            fireEvent.dragEnter(thirdDropArea)
            fireEvent.drop(thirdDropArea)

            fireSeachAction()

            const secondElement1 = screen.getByTestId("issue-item-32449")
            expect(secondElement1.dataset.position).toBe("open-6")
        });
    })
})
