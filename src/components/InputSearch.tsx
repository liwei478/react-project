import { useGlobalContext } from '@/contexts/global'
import { useStyles } from '@/hooks/useStyle'
import { css } from '@emotion/css'
import { Input } from 'antd'
import { SearchIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useCompositionInput } from 'foxact/use-composition-input'

export function InputSearch() {
  const { setMenuSearchWord } = useGlobalContext()

  const inputProps = useCompositionInput(
    useCallback(
      value => {
        setMenuSearchWord?.(value)
      },
      [setMenuSearchWord]
    )
  )
  const { styles } = useStyles(({ token }) => {
    const inputBox = css({
      backgroundColor: token.colorFillTertiary,
      borderRadius: token.borderRadius,
      border: `1px solid ${token.colorFillTertiary}`,

      '&:hover': {
        borderColor: token.colorPrimary
      }
    })

    return { inputBox }
  })

  return (
    <div className={`flex-1 overflow-hidden transition-colors ${styles.inputBox}`}>
      <Input {...inputProps} allowClear prefix={<SearchIcon size={14} />} variant="borderless" />
    </div>
  )
}
