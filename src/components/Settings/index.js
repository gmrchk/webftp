import React, { Component } from 'react';
import { Form, RadioGroup, Radio } from 'informed';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.setFormApi = this.setFormApi.bind(this);
    }

    handleSaveClick() {
        let savedValues = {
            ...this.formApi.getState().values,
        }

        this.props.saveHandler(savedValues);
    }

    componentDidMount() {
        this.formApi.setValue('theme', this.props.settings.theme);
        this.formApi.setValue('animations', this.props.settings.animations);
    }

    componentDidUpdate() {
        this.formApi.setValue('theme', this.props.settings.theme);
        this.formApi.setValue('animations', this.props.settings.animations);
    }

    setFormApi(formApi){
        this.formApi = formApi;
    }

    render() {
        let themes = ["default", "darkBlue", "darkGrey"];
        let animations = ["default", "enabled"];

        return (
            <div className="Settings" key={Math.random()}>
                {this.props.settings &&
                    <Form className="Form" getApi={this.setFormApi}>
                        <fieldset>
                            <legend>Theme</legend>
                            <RadioGroup field="theme">
                                {themes.map(item => {
                                    return (
                                        <div key={item} className="Radio" onChange={this.handleSaveClick}>
                                            <label>
                                                <Radio value={item} /> {item}
                                            </label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </fieldset>

                        <fieldset>
                            <legend>Animations</legend>
                            <RadioGroup field="animations">
                                {animations.map(item => {
                                    return (
                                        <div key={item} className="Radio" onChange={this.handleSaveClick}>
                                            <label>
                                                <Radio value={item} /> {item}
                                            </label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </fieldset>
                        {false &&
                            <div className="FormActions">
                                <button className="Button Button--blue" type="submit" onClick={this.handleSaveClick}>Save</button>
                            </div>
                        }
                    </Form>
                }
            </div>
        );
    }
}
