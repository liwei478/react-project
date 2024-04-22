import { Form, Input, InputRef, Modal, ModalProps } from 'antd'
import { ApiMenuData } from '../ApiMenu'
import { create, useModal } from '@ebay/nice-modal-react'
import { useEffect, useRef } from 'react'
import { useGlobalContext } from '@/contexts/global'
import { nanoid } from 'nanoid'
import { ROOT_CATALOG } from '@/configs/static'
import { SelectorCatalog } from '../SelectorCatalog'

interface ModalNewCatalogProps extends Omit<ModalProps, 'open' | 'onOk'> {
  formData?: Pick<ApiMenuData, 'parentId' | 'type'>
}

type FormData = Pick<ApiMenuData, 'name' | 'parentId' | 'type'>

export const ModalNewCatalog = create(({ formData, ...props }: ModalNewCatalogProps) => {
  const modal = useModal()

  const [form] = Form.useForm<FormData>()

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData)
    }
  }, [form, formData])

  const { addMenuItem } = useGlobalContext()

  const handleHide = () => {
    form.resetFields()
    modal.hide()
  }

  const inputRef = useRef<InputRef>(null)

  return (
    <Modal
      title="新建目录"
      width={400}
      {...props}
      afterOpenChange={(...params) => {
        props.afterOpenChange?.(...params)

        const opened = params.at(0)

        opened && inputRef.current?.focus()
      }}
      open={modal.visible}
      onCancel={(...params) => {
        props.onCancel?.(...params)
        handleHide()
      }}
      onOk={() => {
        form.validateFields().then(values => {
          addMenuItem({
            ...values,
            id: nanoid(6),
            parentId: values.parentId === ROOT_CATALOG ? undefined : values.parentId
          })
          handleHide()
        })
      }}
    >
      <Form<FormData> form={form} initialValues={{ parentId: ROOT_CATALOG }} layout="vertical">
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input ref={inputRef} />
        </Form.Item>

        <Form.Item label="父级目录" name="parentId" required={false} rules={[{ required: true }]}>
          <SelectorCatalog hideCreateNew type={formData?.type} />
        </Form.Item>

        <Form.Item hidden name="type" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})
