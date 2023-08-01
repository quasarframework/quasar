import QInput from '../QInput'

function getHostElement () {
  return cy.get('.q-field')
}

function mountQInput (options) {
  return cy.mount(QInput, options)
}

describe('use-mask API', () => {
  describe('Props', () => {
    describe('Category: behavior', () => {
      describe('(prop): mask', () => {
        const masks = [
          {
            mask: 'card',
            value: '4242424242424242',
            valueWithMask: '4242 4242 4242 4242'
          },
          {
            mask: 'phone',
            value: '2374234234',
            valueWithMask: '(237) 423 - 4234'
          },
          {
            mask: '###@#*#',
            value: '22222',
            valueWithMask: '222@2*2'
          },
          {
            mask: 'fulltime',
            value: '222222',
            valueWithMask: '22:22:22'
          },
          {
            mask: 'time',
            value: '222222',
            valueWithMask: '22:22'
          },
          {
            mask: 'date',
            value: '20230501',
            valueWithMask: '2023/05/01'
          },
          {
            mask: 'datetime',
            value: '2023050106:33',
            valueWithMask: '2023/05/01 06:33'
          }
        ]
        masks.forEach(({ value, valueWithMask, ...props }) => {
          it(`should enforce a '${ props.mask }' mask`, () => {
            mountQInput({
              props
            })

            getHostElement().get('input').type(value)

            getHostElement().get('input')
              .should('not.have.value', value)
              .should('have.value', valueWithMask)
          })
        })
      })

      describe('(prop): fill-mask', () => {
        it('should use a default fill mask if one is not set', () => {
          mountQInput({
            props: {
              fillMask: true,
              mask: '###-###'
            }
          })

          getHostElement().get('input').type('222')

          getHostElement().get('input')
            .should('not.have.value', '222')
            .should('have.value', '222-___')
        })

        it('should use a default fill mask if one is not set', () => {
          mountQInput({
            props: {
              fillMask: '@',
              mask: '###-###'
            }
          })

          getHostElement().get('input').type('222')

          getHostElement().get('input')
            .should('not.have.value', '222')
            .should('have.value', '222-@@@')
        })
      })

      describe('(prop): reverse-fill-mask', () => {
        it('should enforce a reverse-fill-mask', () => {
          mountQInput({
            props: {
              fillMask: true,
              reverseFillMask: true,
              mask: '###-###'
            }
          })

          getHostElement().get('input').type('12345')

          getHostElement().get('input')
            .should('not.have.value', '12345')
            .should('have.value', '_12-345')
        })
      })

      describe('(prop): unmasked-value', () => {
        it.skip(' ', () => {
          //
        })
      })
    })
  })
})
