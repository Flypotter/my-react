//workInProgress 进行中的fiber
let wipRoot = null;
function render(vnode, container) {
    // //console.log(vnode);
    // //vnode->node

    // const node = createNode(vnode);
    // //node->container
    // container.appendChild(node);
    wipRoot = {
        type: 'div',
        props: {
            children: { ...vnode }
        },
        stateNode: container,
    };

    nextUnitOfWork = wipRoot;
}

function createNode(workInProgress) {
    const { type } = workInProgress;

    const node = document.createElement(type);
    updateNode(node, workInProgress.props);

    return node;
}

//类组件
// function updateClassComponent(vnode) {
//     const { type, props } = vnode;
//     const instance = new type(props);
//     const vvnode = instance.render();
//     const node = createNode(vvnode);
//     //console.log(vvnode);
//     return node;
// }

function updateHostComponent(workInProgress) {
    if (!workInProgress.stateNode) {
        workInProgress.stateNode = createNode(workInProgress);
    }

    reconcileChildren(workInProgress, workInProgress.props.children);

    console.log('workInProgress', workInProgress);
}

//更新属性
function updateNode(node, nextVal) {

    Object.keys(nextVal)
        .forEach((k) => {
            if (k === 'children') {
                if (typeof nextVal[k] === 'string') {
                    node.textContent = nextVal[k];
                } else if (Array.isArray(nextVal[k])) {
                    nextVal[k].forEach((item) => {
                        if (typeof item === 'string') {
                            node.textContent = item;
                        }
                    })
                }
            } else {
                node[k] = nextVal[k];
            }

        });
}

// function updateTextComponent(vnode) {
//     const node = document.createTextNode(vnode);
//     return node;
// }

//函数组件
// function updateFunctionComponent(vnode) {
//     const { type, props } = vnode;
//     const vvnode = type(props);
//     const node = createNode(vvnode);
//     console.log(vvnode);
//     return node;
// }

function reconcileChildren(workInProgress, children) {
    if (typeof children === 'string' || typeof children === 'number') {
        return;
    }

    const newChildren = Array.isArray(children) ? children : [children];

    let previousNewFiber = null;
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        let newFiber = {
            type: child.type,
            props: { ...child.props },
            stateNode: null,
            child: null,
            sibling: null,
            return: workInProgress,
        };
        if (i === 0) {
            //第一个fiber
            workInProgress.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }

        //记录上一个fiber
        previousNewFiber = newFiber;
    }
}

//下一个单元任务 fiber
let nextUnitOfWork = null;
//fiber
//type 类型
//key
//props
//stateNode
//child 第一个子节点
//sibling 下一个兄弟节点
//return 父节点
function performUnitOfWork(workInProgress) {
    //执行任务 todo
    const { type } = workInProgress;
    if (typeof type === 'string') {
        //原生标签节点
        updateHostComponent(workInProgress);
    }
    //返回下一个执行任务
    if (workInProgress.child) {
        return workInProgress.child;
    }

    let nextFiber = workInProgress;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.return;
    }
}

function workLoop(IdleDeadline) {
    while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    //提交更新
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
}

requestIdleCallback(workLoop);

function commitRoot() {
    commitWork(wipRoot.child);
    console.log('2', wipRoot);
    wipRoot = null;
}

function commitWork(workInProgress) {
    //提交自己
    if (!workInProgress) {
        return;
    }
    console.log('1', workInProgress);
    let parentNodeFiber = workInProgress.return;
    let parentNode = parentNodeFiber.stateNode;

    if (workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode);

    }

    //提交子节点
    commitWork(workInProgress.child);
    //提交兄弟节点
    commitWork(workInProgress.sibling);
}

export default { render };