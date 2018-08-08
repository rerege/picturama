import * as classNames from 'classnames'
import * as React from 'react'
import * as Loader from 'react-loader'
import { connect } from 'react-redux'

import keymapManager from '../keymap-manager'
import Photo, { PhotoType } from '../models/Photo'
import { closeDiffAction } from '../state/actions'
import { AppState } from '../state/reducers'


let rotation = {}

rotation[1] = ''
rotation[8] = 'minus-ninety'


interface OwnProps {
    className?: any
}

interface StateProps {
    photo: PhotoType
}

interface DispatchProps {
    closeDiff: () => {}
}

interface Props extends OwnProps, StateProps, DispatchProps {
}

interface State {
    photo: Partial<PhotoType>
    loaded: boolean
    loadingCount: number
}

export class PictureDiff extends React.Component<Props, State> {

    constructor(props) {
        super(props)

        this.onImgLoad = this.onImgLoad.bind(this)

        this.state = {
            photo: { thumb: null },
            loaded: false,
            loadingCount: 0
        }
    }

    componentDidMount() {
        new Photo({ id: this.props.photo.id })
            .fetch({ withRelated: [ 'versions' ] })
            .then(photo => {
                this.setState({ photo: photo.toJSON() })
            })

        window.addEventListener('core:cancel', this.props.closeDiff)
        window.addEventListener('diff:cancel', this.props.closeDiff)

        keymapManager.bind(this.refs.diff)
    }

    onImgLoad() {
        let nextState = { ...this.state }

        nextState.loadingCount++

        if (nextState.loadingCount >= 2) {
            nextState.loaded = true
        }

        this.setState(nextState)
    }

    componentWillUnmount() {
        window.removeEventListener('core:cancel', this.props.closeDiff)
        window.removeEventListener('diff:cancel', this.props.closeDiff)
        keymapManager.unbind()
    }

    render() {
        let last: Partial<PhotoType> & { output?: string } = { thumb: null }

        let className = [
            'shadow--2dp',
            rotation[this.props.photo.orientation]
        ].join(' ')

        if (this.state.photo.hasOwnProperty('versions'))
            last = this.state.photo.versions[this.state.photo.versions.length - 1]

        return (
            <div className={classNames(this.props.className, "picture-diff")} ref="diff">
                <div className="before v-align">
                    <h3>Before</h3>
                    <img
                        src={this.state.photo.thumb}
                        onLoad={this.onImgLoad}
                        className={className} />
                </div>

                <div className="after v-align">
                    <h3>After</h3>
                    <img
                        src={last.output}
                        onLoad={this.onImgLoad}
                        className={className} />
                </div>

                <Loader loaded={this.state.loaded} />
            </div>
        )
    }
}


const Connected = connect<StateProps, DispatchProps, OwnProps, AppState>(
    (state, props) => {
        const mainFilter = state.library.filter.mainFilter
        return {
            ...props,
            photo: state.library.photos.data[state.detail.currentPhoto.id]
        }
    },
    {
        closeDiff: closeDiffAction
    }
)(PictureDiff)

export default Connected
