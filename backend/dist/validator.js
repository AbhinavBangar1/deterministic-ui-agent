import { COMPONENT_LIBRARY, ALLOWED_LAYOUTS } from './types.js';
function findComponentInLibrary(componentType) {
    const found = COMPONENT_LIBRARY.components.find(comp => comp.name === componentType);
    return found || null;
}
// Validate single component 
function validateComponent(component) {
    const errors = [];
    const allowedComponent = findComponentInLibrary(component.type);
    if (!allowedComponent) {
        errors.push(`Component type "${component.type}" is not in the allowed library`);
        return { isValid: false, errors };
    }
    const propKeys = Object.keys(component.props);
    for (const propKey of propKeys) {
        if (!allowedComponent.allowedProps.includes(propKey)) {
            errors.push(`Prop "${propKey}" is not allowed for component "${component.type}". ` +
                `Allowed props: ${allowedComponent.allowedProps.join(', ')}`);
        }
    }
    if (component.children && component.children.length > 0) {
        for (const child of component.children) {
            if (typeof child === 'object') {
                const childResult = validateComponent(child);
                if (!childResult.isValid) {
                    errors.push(...childResult.errors);
                }
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
// Validate entire plan
export function validatePlan(plan) {
    const errors = [];
    if (!ALLOWED_LAYOUTS.includes(plan.layout)) {
        errors.push(`Layout "${plan.layout}" is not valid. ` +
            `Allowed layouts: ${ALLOWED_LAYOUTS.join(', ')}`);
    }
    for (const component of plan.components) {
        const result = validateComponent(component);
        if (!result.isValid) {
            errors.push(...result.errors);
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
// Validate generated code
export function validateCode(code) {
    const errors = [];
    if (!code.includes('export default function')) {
        errors.push('Code must export a default function component');
    }
    const forbiddenPatterns = [
        { pattern: /style\s*=\s*{/g, message: 'Inline styles are not allowed' },
        { pattern: /dangerouslySetInnerHTML/g, message: 'dangerouslySetInnerHTML is not allowed' },
        { pattern: /eval\(/g, message: 'eval() is not allowed' },
    ];
    forbiddenPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(code)) {
            errors.push(message);
        }
    });
    if (code.includes('import') && !code.includes("from '@/components/ui'")) {
        errors.push("Components must be imported from '@/components/ui'");
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
