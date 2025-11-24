import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.calculateNoComponents();
    }

    // @methodtype conversion-method
    protected doClone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    // @methodtype command-method
    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponents();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    // @methodtype helper-method
    protected getComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = '';
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                components.push(currentComponent);
                currentComponent = '';
                i++;
            } else {
                currentComponent += this.name[i];
                i++;
            }
        }
        
        components.push(currentComponent);
        return components;
    }

    // @methodtype helper-method
    protected calculateNoComponents(): number {
        if (this.name === "") {
            return 0;
        }
        return this.getComponents().length;
    }

}