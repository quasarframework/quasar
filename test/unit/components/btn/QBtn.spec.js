import {mount} from "@vue/test-utils";
import QBtn from "@/components/btn/QBtn";
global.__THEME__ = 'ios';
describe("QBtn", ()=>{
    test("emit click event on click", ()=>{
        let wrapper = mount(QBtn);
        wrapper.element.click();
        expect(wrapper.emitted().click).toBeTruthy;
    })
})