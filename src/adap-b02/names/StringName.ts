import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.calculateNoComponents();
    }

    public asString(delimiter: string = this.delimiter): string {
        // Convert to components, unmask them, and join with the desired delimiter
        const components = this.getComponents();
        return components
            .map(c => this.unmaskComponent(c))
            .join(delimiter);
    }

    public asDataString(): string {
        // Return the internal string representation with default delimiter
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.name;
        }
        // Convert to default delimiter
        const components = this.getComponents();
        return components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /**
     * Splits the name string into components, respecting escape characters
     */
    protected getComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = '';
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                // Escape sequence - add both escape and next character
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                // Delimiter - finish current component and start new one
                components.push(currentComponent);
                currentComponent = '';
                i++;
            } else {
                // Regular character
                currentComponent += this.name[i];
                i++;
            }
        }
        
        // Add the last component
        components.push(currentComponent);
        
        return components;
    }

    /**
     * Calculates the number of components in the name
     */
    protected calculateNoComponents(): number {
        if (this.name === "") {
            return 0;
        }
        return this.getComponents().length;
    }

    /**
     * Unmasks a component by removing escape characters
     */
    protected unmaskComponent(component: string): string {
        let result = '';
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                // Skip the escape character and add the next character
                result += component[i + 1];
                i += 2;
            } else {
                result += component[i];
                i++;
            }
        }
        return result;
    }

}