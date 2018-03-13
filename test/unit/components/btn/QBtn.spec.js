import {mount} from "@vue/test-utils";
import QBtn from "@/components/btn/QBtn";

describe("QBtn", ()=>{
    test("emit click event on click", ()=>{
        let wrapper = mount(QBtn);
        wrapper.element.click();
        expect(wrapper.emitted().click).toBeTruthy;
    })
})