import React, { Component, Fragment } from "react";
import { injectIntl} from 'react-intl';
import {
    Row,
    Card,
    CustomInput,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ButtonDropdown,
    UncontrolledDropdown,
    Collapse,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Input,
    CardBody,
    CardSubtitle,
    CardImg,
    Label,
    CardText,
    Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import classnames from "classnames";

import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";
import mouseTrap from "react-mousetrap";
import { Table } from 'antd';
import  'antd/dist/antd.min.css';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
function collect(props) {
    return { data: props.data };
}
const apiUrl ="http://api.crealeaf.com/cakes/paging"

const columns = [
    {
        title: 'Age',
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    }
]
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    }
    ];
class list extends Component {
    constructor(props) {
        super(props);
        this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.dataListRender = this.dataListRender.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getIndex = this.getIndex.bind(this);
        this.onContextMenuClick = this.onContextMenuClick.bind(this);
        this.state = {
            displayMode: "thumblist",
            pageSizes: [8, 12, 24],
            selectedPageSize: 8,
            categories:  [
                {label:'Cakes',value:'Cakes',key:0},
                {label:'Cupcakes',value:'Cupcakes',key:1},
                {label:'Desserts',value:'Desserts',key:2},
            ],
            orderOptions:[
                {column: "title",label: "Product Name"},
                {column: "type.js",label: "Category"},
                {column: "status",label: "Status"}
            ],
            selectedOrderOption:  {column: "title",label: "Product Name"},
            dropdownSplitOpen: false,
            modalOpen: false,
            currentPage: 1,
            totalItemCount: 0,
            totalPage: 1,
            search: "",
            selectedItems: [],
            lastChecked: null,
            displayOptionsIsOpen: false,
            isLoading:false
        };
    }
    componentWillMount() {
        this.props.bindShortcut(["ctrl+a", "command+a"], () =>
            this.handleChangeSelectAll(false)
        );
        this.props.bindShortcut(["ctrl+d", "command+d"], () => {
            this.setState({
                selectedItems: []
            });
            return false;
        });
    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }
    toggleDisplayOptions() {
        this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
    }
    toggleSplit() {
        this.setState(prevState => ({
            dropdownSplitOpen: !prevState.dropdownSplitOpen
        }));
    }
    changeOrderBy(column) {
        this.setState(
            {
                selectedOrderOption: this.state.orderOptions.find(
                    x => x.column === column
                )
            },
            () => this.dataListRender()
        );
    }
    changePageSize(size) {
        this.setState(
            {
                selectedPageSize: size,
                currentPage: 1
            },
            () => this.dataListRender()
        );
    }
    changeDisplayMode(mode) {
        this.setState({
            displayMode: mode
        });
        return false;
    }
    onChangePage(page) {
        this.setState(
            {
                currentPage: page
            },
            () => this.dataListRender()
        );
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.setState(
                {
                    search: e.target.value.toLowerCase()
                },
                () => this.dataListRender()
            );
        }
    }

    handleCheckChange(event, id) {
        if (
            event.target.tagName == "A" ||
            (event.target.parentElement &&
                event.target.parentElement.tagName == "A")
        ) {
            return true;
        }
        if (this.state.lastChecked == null) {
            this.setState({
                lastChecked: id
            });
        }

        let selectedItems = this.state.selectedItems;
        if (selectedItems.includes(id)) {
            selectedItems = selectedItems.filter(x => x !== id);
        } else {
            selectedItems.push(id);
        }
        this.setState({
            selectedItems
        });

        if (event.shiftKey) {
            var items = this.state.items;
            var start = this.getIndex(id, items, "id");
            var end = this.getIndex(this.state.lastChecked, items, "id");
            items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
            selectedItems.push(
                ...items.map(item => {
                    return item.id;
                })
            );
            selectedItems = Array.from(new Set(selectedItems));
            this.setState({
                selectedItems
            });
        }
        document.activeElement.blur();
    }

    getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return i;
            }
        }
        return -1;
    }
    handleChangeSelectAll(isToggle) {
        if (this.state.selectedItems.length >= this.state.items.length) {
            if (isToggle) {
                this.setState({
                    selectedItems: []
                });
            }
        } else {
            this.setState({
                selectedItems: this.state.items.map(x => x.id)
            });
        }
        document.activeElement.blur();
        return false;
    }
    componentDidMount() {
        this.dataListRender();
    }

    dataListRender() {

        const {selectedPageSize,currentPage,selectedOrderOption,search} = this.state;

    }

    onContextMenuClick = (e, data, target) => {
        console.log("onContextMenuClick - selected items",this.state.selectedItems)
        console.log("onContextMenuClick - action : ", data.action);
    };

    onContextMenu = (e, data) => {
        const clickedProductId = data.data;
        if (!this.state.selectedItems.includes(clickedProductId)) {
            this.setState({
                selectedItems :[clickedProductId]
            });
        }

        return true;
    };

    render() {
        const startIndex= (this.state.currentPage-1)*this.state.selectedPageSize
        const endIndex= (this.state.currentPage)*this.state.selectedPageSize
        const {messages} = this.props.intl;
        return (
            !this.state.isLoading?
                <div className="loading"></div>
                :
                <Fragment>
                    <div className="disable-text-selection">
                        <Row>
                            <Colxx xxs="12">
                                <div className="mb-2">
                                    <h1>
                                        <IntlMessages id="menu.thumb-list" />
                                    </h1>

                                    <div className="float-sm-right">
                                        <Button
                                            color="primary"
                                            size="lg"
                                            className="top-right-button"
                                            onClick={this.toggleModal}
                                        >
                                            <IntlMessages id="layouts.add-new" />
                                        </Button>
                                        {"  "}

                                        <Modal
                                            isOpen={this.state.modalOpen}
                                            toggle={this.toggleModal}
                                            wrapClassName="modal-right"
                                            backdrop="static"
                                        >
                                            <ModalHeader toggle={this.toggleModal}>
                                                <IntlMessages id="layouts.add-new-modal-title" />
                                            </ModalHeader>
                                            <ModalBody>
                                                <Label>
                                                    <IntlMessages id="layouts.product-name" />
                                                </Label>
                                                <Input />
                                                <Label className="mt-4">
                                                    <IntlMessages id="layouts.category" />
                                                </Label>
                                                <Select
                                                    components={{ Input: CustomSelectInput }}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    name="form-field-name"
                                                    options={this.state.categories}
                                                />
                                                <Label className="mt-4">
                                                    <IntlMessages id="layouts.description" />
                                                </Label>
                                                <Input type="textarea" name="text" id="exampleText" />
                                                <Label className="mt-4">
                                                    <IntlMessages id="layouts.status" />
                                                </Label>
                                                <CustomInput
                                                    type="radio"
                                                    id="exCustomRadio"
                                                    name="customRadio"
                                                    label="ON HOLD"
                                                />
                                                <CustomInput
                                                    type="radio"
                                                    id="exCustomRadio2"
                                                    name="customRadio"
                                                    label="PROCESSED"
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    color="secondary"
                                                    outline
                                                    onClick={this.toggleModal}
                                                >
                                                    <IntlMessages id="layouts.cancel" />
                                                </Button>
                                                <Button color="primary" onClick={this.toggleModal}>
                                                    <IntlMessages id="layouts.submit" />
                                                </Button>{" "}
                                            </ModalFooter>
                                        </Modal>
                                        <ButtonDropdown
                                            isOpen={this.state.dropdownSplitOpen}
                                            toggle={this.toggleSplit}
                                        >
                                            <div className="btn btn-primary pl-4 pr-0 check-button">
                                                <Label
                                                    for="checkAll"
                                                    className="custom-control custom-checkbox mb-0 d-inline-block"
                                                >
                                                    <Input
                                                        className="custom-control-input"
                                                        type="checkbox"
                                                        id="checkAll"
                                                        checked={
                                                            this.state.selectedItems.length >=
                                                            this.state.items.length
                                                        }
                                                        onClick={() => this.handleChangeSelectAll(true)}
                                                    />
                                                    <span
                                                        className={`custom-control-label ${
                                                            this.state.selectedItems.length > 0 &&
                                                            this.state.selectedItems.length <
                                                            this.state.items.length
                                                                ? "indeterminate"
                                                                : ""
                                                            }`}
                                                    />
                                                </Label>
                                            </div>
                                            <DropdownToggle
                                                caret
                                                color="primary"
                                                className="dropdown-toggle-split pl-2 pr-2"
                                            />
                                            <DropdownMenu right>
                                                <DropdownItem>
                                                    <IntlMessages id="layouts.delete" />
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <IntlMessages id="layouts.another-action" />
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>

                                    <BreadcrumbItems match={this.props.match} />
                                </div>

                                <div className="mb-2">
                                    <Button
                                        color="empty"
                                        className="pt-0 pl-0 d-inline-block d-md-none"
                                        onClick={this.toggleDisplayOptions}
                                    >
                                        <IntlMessages id="layouts.display-options" />{" "}
                                        <i className="simple-icon-arrow-down align-middle" />
                                    </Button>
                                    <Collapse
                                        isOpen={this.state.displayOptionsIsOpen}
                                        className="d-md-block"
                                        id="displayOptions"
                                    >

                                        <div className="d-block d-md-inline-block">
                                            <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                                                <DropdownToggle caret color="outline-dark" size="xs">
                                                    <IntlMessages id="layouts.orderby" />
                                                    {this.state.selectedOrderOption.label}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {this.state.orderOptions.map((order, index) => {
                                                        return (
                                                            <DropdownItem
                                                                key={index}
                                                                onClick={() => this.changeOrderBy(order.column)}
                                                            >
                                                                {order.label}
                                                            </DropdownItem>
                                                        );
                                                    })}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                            <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                                                <input
                                                    type="text"
                                                    name="keyword"
                                                    id="search"
                                                    placeholder={messages["menu.search"]}
                                                    onKeyPress={e => this.handleKeyPress(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="float-md-right">
                      <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${
                          this.state.totalItemCount
                          } `}</span>
                                            <UncontrolledDropdown className="d-inline-block">
                                                <DropdownToggle caret color="outline-dark" size="xs">
                                                    {this.state.selectedPageSize}
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    {this.state.pageSizes.map((size, index) => {
                                                        return (
                                                            <DropdownItem
                                                                key={index}
                                                                onClick={() => this.changePageSize(size)}
                                                            >
                                                                {size}
                                                            </DropdownItem>
                                                        );
                                                    })}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </Collapse>
                                </div>
                                <Separator className="mb-5" />
                            </Colxx>
                        </Row>
                        <Row>
                            <Table style={{width: "100%"}} columns={columns} dataSource={data} />
                        </Row>
                    </div>

                    <ContextMenu
                        id="menu_id"
                        onShow={e => this.onContextMenu(e, e.detail.data)}
                    >
                        <MenuItem
                            onClick={this.onContextMenuClick}
                            data={{ action: "copy" }}
                        >
                            <i className="simple-icon-docs" /> <span>Copy</span>
                        </MenuItem>
                        <MenuItem
                            onClick={this.onContextMenuClick}
                            data={{ action: "move" }}
                        >
                            <i className="simple-icon-drawer" /> <span>Move to archive</span>
                        </MenuItem>
                        <MenuItem
                            onClick={this.onContextMenuClick}
                            data={{ action: "delete" }}
                        >
                            <i className="simple-icon-trash" /> <span>Delete</span>
                        </MenuItem>
                    </ContextMenu>
                </Fragment>
        );
    }
}
export default injectIntl(mouseTrap(list))
