export interface ComponentDef {
  id: string
  type: string
  props: Record<string, any>
  children?: (ComponentDef | string)[]
}

export interface StructuredPlan {
  layout: string
  components: ComponentDef[]
  reasoning: string
}

export interface VersionState {
  version: number
  timestamp: string
  userRequest: string
  plan: StructuredPlan
  code: string
  explanation: string
}

export interface AllowedComponent {
  name: string
  allowedProps: string[]
}

export interface ComponentLibrary {
  components: AllowedComponent[]
}

export const COMPONENT_LIBRARY: ComponentLibrary = {
  components: [
    {
      name: 'Button',
      allowedProps: ['variant', 'children', 'onClick']
    },
    {
      name: 'Card',
      allowedProps: ['title', 'children']
    },
    {
      name: 'Input',
      allowedProps: ['type', 'placeholder', 'value', 'onChange']
    },
    {
      name: 'Table',
      allowedProps: ['columns', 'data', 'headers']
    },
    {
      name: 'Modal',
      allowedProps: ['isOpen', 'title', 'children', 'onClose']
    },
    {
      name: 'Sidebar',
      allowedProps: ['items', 'children']
    },
    {
      name: 'Navbar',
      allowedProps: ['title', 'items']
    },
    {
      name: 'Chart',
      allowedProps: ['type', 'data', 'title']
    }
  ]
}

export const ALLOWED_LAYOUTS = ['dashboard', 'two-column', 'three-column', 'single']
