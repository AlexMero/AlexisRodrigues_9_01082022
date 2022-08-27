/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event'
import { ROUTES, ROUTES_PATH } from "../constants/routes"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import NewBillUI from "../views/NewBillUI.js";
import LoginUI from "../views/LoginUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      // @ts-ignore
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      // @ts-ignore
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.className).toContain('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      // @ts-ignore
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then I can see proof by clicking in eye icon", async () => {
      // @ts-ignore
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = screen.getAllByTestId('icon-eye')[0]
      expect(iconEye).toBeTruthy()
    })
    test("Then i can click in 'Nouvelle note de frais'", async () => {
      // @ts-ignore
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        //@ts-ignore
        document.body.innerHTML = ROUTES({ pathname })
      }
      const containerBills = new Bills({ document, onNavigate, store: null, localStorage })
      const newBillBtn = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(containerBills.handleClickNewBill);
      expect(newBillBtn).toBeTruthy()
      newBillBtn.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillBtn)
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })
})
