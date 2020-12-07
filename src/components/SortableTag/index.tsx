import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Tag, Input, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import { Sortable } from '@/components'

// className 容器类名，必须
// pull 容器是否可以拖入属性
// isCanPutIn 当元素被拖入时判断是否可以被拖入
// animation 动画时间 默认150ms
// handleClassName 可拖拽的类名，无则为子元素
// onUpdate 发生更新时调用方法
// onFilter
// 详细参数请参考 https://segmentfault.com/a/1190000008209715

const SortableTag = (props) => {
  const [list, setList] = useState<undefined | any[]>(undefined)
  const [value, setValue] = useState<undefined | string | number>(undefined)
  useEffect(() => {
    setList(props.value)
  }, [props.value])
  const onUpdate = useCallback((list) => {
    if (props.onChange && typeof props.onChange === 'function') {
      props.onChange(list)
    } else {
      setList(() => {
        return list
      })
    }
  }, [])
  const onAdd = useCallback(() => {
    if (!!!value) {
      return
    }
    onUpdate(list ? [...list, { editable: 1, name: value }] : [{ editable: 1, name: value }])
    setValue(undefined)
  }, [value, list])
  const onDelete = useCallback((index) => {
    
    const _list = [...(list || [])]
    _list.splice(index, 1)
    onUpdate(_list)
  }, [list])
  const sortableUpdate = useCallback((evt, list) => {
    const { newIndex, oldIndex } = evt;
    const isMoveToPrevious = oldIndex - newIndex > 0;
    // console.log('--before--', list)
    let newSort: any[] = [];
    for (let index = 0, len = list!.length; index < len; index++) {
      if (isMoveToPrevious) {
        if (index < newIndex) {
          newSort[index] = list![index];
        } else if (index === newIndex) {
          newSort[index] = list![oldIndex];
        } else if (index <= oldIndex) {
          newSort[index] = list![index - 1];
        } else {
          newSort[index] = list![index];
        }
      } else {
        if (index < oldIndex) {
          newSort[index] = list![index];
        } else if (index < newIndex) {
          newSort[index] = list![index + 1];
        } else if (index === newIndex) {
          newSort[index] = list![oldIndex];
        } else {
          newSort[index] = list![index];
        }
      }
    }
    // console.log('--after--', newSort)
    onUpdate(newSort)
  }, [])
  const editItem = useCallback((index, value) => {
    const _list = [...(list || [])]
    _list[index].name = value
    onUpdate(_list)
  }, [list])
  // console.log('show', list)
  return <div>
    {
      list && list.length > 0 && <Sortable className='custom-tag-sortable-container' onUpdate={(evt) => sortableUpdate(evt, list)}>
        {
          list.map((item, index) => {
            return item.editable === 0 ? <Tag closable onClose={() => onDelete(index)} key={`${item.name}-${index}`} style={{ marginBottom: 6 }}>{item.name}</Tag> : <EditTag key={`${item.name}-${index}`} onDelete={() => onDelete(index)} name={item.name} onChange={editItem} index={index} style={{ marginBottom: 6 }} />
          })
        }
      </Sortable>
    }

    {
      props.showAdd && <span style={{ marginTop: 8 }}>
        <Input size='small' style={{ width: 120 }} value={value} onChange={(evt) => setValue(evt.target.value)} />
        <Button onClick={onAdd} size='small' type='primary'>添加</Button>
      </span>
    }
  </div>
}

const EditTag = (props) => {
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(props.name)
  const inputRef = useRef<Input | null>(null)
  const onBlur = useCallback(() => {
    if (props.onChange) {
      props.onChange(props.index, value)
    }
    setEdit(false)
  }, [value])
  useEffect(() => {
    setValue(props.name)
  }, [props.name])
  return edit ? <Input ref={node => inputRef.current = node} size='small' style={{ width: 120, marginBottom: 6, minWidth: 'auto' }} onBlur={onBlur} value={value} onChange={(evt) => setValue(evt.target.value)} /> : <Tag color='purple' style={{ marginBottom: 6 }}><span style={{cursor: 'text'}} onClick={() => {
    setEdit(true)
    setTimeout(() => {  // 为了等待input生成后再获取焦点，故将这段代码放入微任务里
      inputRef.current?.focus()
    }, 100)
  }}>{value}</span><CloseOutlined onClick={() => props.onDelete(props.index)} /></Tag>
}

export default SortableTag