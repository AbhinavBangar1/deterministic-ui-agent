export const COMPONENT_LIBRARY = {
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
};
export const ALLOWED_LAYOUTS = ['dashboard', 'two-column', 'three-column', 'single'];
