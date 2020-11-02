import { Command } from '../Editor'
import { createExtension } from '../Extension'

export const ResetNodeAttributes = createExtension({
  addCommands() {
    return {
      resetNodeAttributes: (attributeNames: string[] = []): Command => ({ tr, state, dispatch }) => {
        const { selection } = tr
        const { from, to } = selection

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (!node.type.isText) {
            attributeNames.forEach(name => {
              const attribute = node.type.spec.attrs?.[name]
              const defaultValue = attribute?.default

              if (attribute && defaultValue !== undefined && dispatch) {
                tr.setNodeMarkup(pos, undefined, {
                  [name]: defaultValue,
                })
              }
            })
          }
        })

        return true
      },
    }
  },
})

declare module '../Editor' {
  interface AllExtensions {
    ResetNodeAttributes: typeof ResetNodeAttributes,
  }
}