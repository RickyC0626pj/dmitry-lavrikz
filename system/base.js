class Base{
    constructor(resources){
        this.resources = resources;
        let cfull = `{{call}}${this.resources.settings.mixinNames.container}-full()`;
        let clfix = `{{call}}${this.resources.settings.mixinNames.clearfix}()`;
        let roff = `{{call}}${this.resources.settings.mixinNames.rowOffsets}()`;
        
        this.content = {
            container: {
                'max-width': this.resources.settings.container.maxWidth,
                margin: "0 auto",
                [cfull]: null
            },
            row: {
                display: "flex",
                'flex-wrap': "wrap",
                [roff]: null
            },
            rowFloat: {
                [roff]: null,
                [clfix]: null
            },
            column: {
                'box-sizing': "border-box",
                'margin-left': "{{var}}offset_one_side",
                'margin-right': "{{var}}offset_one_side",
                'word-wrap': "break-word"
            },
            columnFloat: {
                'float': 'left'
            },
            columnPadding: {
                'padding-left': "{{var}}offset_one_side",
                'padding-right': "{{var}}offset_one_side",
                'word-wrap': "break-word"
            }
        };
    }

    render() {
        let out = "";

        let containerFull = {
            'padding-left': this.resources.settings.container.fields,
            'padding-right': this.resources.settings.container.fields
        };
        
        let rowOffsets = {
            'margin-left': "({{var}}offset_one_side * -1)",
            'margin-right': "({{var}}offset_one_side * -1)"
        }

        let containerStyles = '';
        let rowStyles = '';

        let cont = this.resources.styles.objToStyles(containerFull, 1);
        let row = this.resources.styles.objToStyles(rowOffsets, 1);
        let media = new this.resources.media();
        containerStyles += media.wrap(cont);
        rowStyles += media.wrap(row);

        for (let name in this.resources.settings.breakPoints) {
            let point = this.resources.settings.breakPoints[name];
            
            if(point.fields !== undefined){
                containerStyles += '\n\n' + this.resources.styles.objToCallMedia(name + '-block', {
                    'padding-left': point.fields,
                    'padding-right': point.fields
                }, 1);
            }
            
            if(point.offset !== undefined){
                rowStyles += '\n\n' + this.resources.styles.objToCallMedia(name + '-block', {
                    'margin-left': `(${point.offset} / -2)`,
                    'margin-right': `(${point.offset} / -2)`
                }, 1);
            }
        }

        let mixinWrapper = new this.resources.mixin(this.resources.patterns.mixin, this.resources.settings.mixinNames.container + '-full', '', containerStyles);
        out += mixinWrapper.render(this.resources.settings.outputStyle) + '\n\n';
        
        let mixinRow = new this.resources.mixin(this.resources.patterns.mixin, this.resources.settings.mixinNames.rowOffsets , '', rowStyles);
        out += mixinRow.render(this.resources.settings.outputStyle) + '\n\n';

        for (let name in this.resources.settings.mixinNames) {
            if(this.content[name] !== undefined){
                let selector = this.resources.settings.mixinNames[name];
                let styles = this.resources.styles.objToStyles(this.content[name], 1);
                let media = new this.resources.media();
                let mixin = new this.resources.mixin(this.resources.patterns.mixin, selector, '', media.wrap(styles));

                out += mixin.render() + '\n\n';
            }
        }

        return out;
    }
}

module.exports = Base;