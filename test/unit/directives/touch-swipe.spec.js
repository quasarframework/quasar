import { mouseEvents } from '../../mocks/'
import TouchSwipe from '@/directives/touch-swipe'
import { mount } from '@vue/test-utils'


const Listener = {
    bind(el, binding){
        el.addEventListener('touchstart', function(e){
            console.log('touchstart:fired', e)
        })
        el.addEventListener('touchend', function(e){
            console.log('touchstart:ended', e)
        })
    }
}


describe('TouchSwipe', () => {
    test('provides directions of swipe', async ()=>{        
        let fired = false;
        const wrapper = mount({ template: `<div v-touch-swipe="onSwipe" />`, 
            directives:{ TouchSwipe},
            methods:{
                onSwipe(e){
                    expect(e.direction).toBe('left')
                    fired = true
                }
            }
        })
        wrapper.trigger('touchstart', mouseEvents.east)
        wrapper.trigger('touchmove', mouseEvents.middle)
        wrapper.trigger('touchend', mouseEvents.west)
        expect(fired).toBe(true)     
    })
})