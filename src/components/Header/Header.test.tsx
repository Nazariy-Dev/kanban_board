import {fireEvent, render, screen} from "@testing-library/react";
import {describe, it, expect} from "vitest"
import "@testing-library/jest-dom/vitest"
import Header from "./Header.tsx";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "../ui/provider.tsx";


const MockedHeader = () => {
    return <Provider>
        <BrowserRouter>
            <Header/>
        </BrowserRouter>
    </Provider>

}

describe("Search input validation test", () => {
    render(<MockedHeader/>)

    it("shows error when input is number", () => {

        const inputElement = screen.getByPlaceholderText("Enter repo URL")
        const buttonElement = screen.getByRole("button", {name: /Search/i})

        fireEvent.change(inputElement, {target: {value: "6"}})

        fireEvent.click(buttonElement)
        screen.debug()

        const errorLabel = screen.getByText(/Url is not valid/i)

        expect(errorLabel).toBeInTheDocument()
    })

    it("shows error when input is invalid URL", () => {

        const inputElement = screen.getByPlaceholderText("Enter repo URL")
        const buttonElement = screen.getByRole("button", {name: /Search/i})
        fireEvent.change(inputElement, {target: {value: "https://github.com/faceboook/react"}})
        fireEvent.click(buttonElement)


        const errorLabel = screen.queryByText(/Url is not valid/i)

        expect(errorLabel).not.toBeTruthy()
    })
})
