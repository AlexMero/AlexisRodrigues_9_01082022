/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js"
import userEvent from "@testing-library/user-event"
import store from '../__mocks__/store'



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can submit a new bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId("form-new-bill")
      expect(form).toBeTruthy()
    })
    test("Then i can add proof", () => {
      const onNavigate = (pathname) => {
        //@ts-ignore
        document.body.innerHTML = ROUTES({ pathname })
      }
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee',
        email: 'test@test.te'
      }))
      const newBill = new NewBill({ document, onNavigate, store: store, localStorage })
      const handleChangeFile = jest.fn((e) => {newBill.handleChangeFile(e)});
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(['test.png'], 'test.png', {
            type: 'image/png',
            }),
          ],
        },
      })
      expect(handleChangeFile).toHaveBeenCalled();
      expect(fileInput.files[0].name).toBe('test.png');
    })
    test("Then i can submit a form", () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee',
        email: 'johndoe@email.com',
        password: 'azerty'
      }))
      const onNavigate = (pathname) => {
        //@ts-ignore
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const form = screen.getByTestId("form-new-bill")
      form.addEventListener("submit", handleSubmit)
      const submitButton = screen.getByTestId("submit")
      submitButton.click()
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
